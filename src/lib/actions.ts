"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { createClient as createServerClient } from "./supabase-server";
import { hashPin, verifyPin } from "./pin";
import { CATEGORY_MAP } from "./categories";

function str(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function pinDigits(form: FormData, key: string) {
  const v = str(form, key);
  return /^\d{4}$/.test(v) ? v : "";
}

export type ActionResult =
  | { ok: true; redirect?: string }
  | { ok: false; error: string };

async function uploadGroupImage(
  client: Awaited<ReturnType<typeof createServerClient>>,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await client.storage
    .from("group-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error || !data) return null;
  return client.storage.from("group-images").getPublicUrl(data.path).data.publicUrl;
}

export async function createGroup(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const title = str(form, "title");
  const description = str(form, "description");
  const category = str(form, "category");
  const region = str(form, "region");
  const maxMembers = Number(str(form, "max_members"));
  const creatorNickname = str(form, "creator_nickname");
  const pin = pinDigits(form, "edit_pin");
  const meetingFrequency = str(form, "meeting_frequency");
  const meetingDay = str(form, "meeting_day");
  const meetingTime = str(form, "meeting_time");
  const minAgeRaw = str(form, "min_age");
  const maxAgeRaw = str(form, "max_age");
  const minAge = minAgeRaw ? Number(minAgeRaw) : null;
  const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (title.length < 2 || title.length > 60)
    return { ok: false, error: "모임 이름은 2~60자로 입력해 주세요." };
  if (description.length > 2000)
    return { ok: false, error: "소개글은 2000자 이내로 입력해 주세요." };
  if (!CATEGORY_MAP[category])
    return { ok: false, error: "카테고리를 선택해 주세요." };
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 200)
    return { ok: false, error: "정원은 2~200명으로 입력해 주세요." };
  if (region.length > 30)
    return { ok: false, error: "지역은 30자 이내로 입력해 주세요." };
  if (minAge !== null && maxAge !== null && minAge > maxAge)
    return { ok: false, error: "최소 나이가 최대 나이보다 클 수 없어요." };

  if (!user) {
    if (creatorNickname.length < 1 || creatorNickname.length > 20)
      return { ok: false, error: "닉네임은 1~20자로 입력해 주세요." };
    if (!pin)
      return { ok: false, error: "수정용 PIN은 숫자 4자리로 입력해 주세요." };
  }

  // 이미지 업로드
  let imageUrl: string | null = null;
  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadGroupImage(authClient, imageFile);
  }

  const displayName = user?.user_metadata?.name || user?.user_metadata?.full_name || creatorNickname;

  const { data, error } = await supabase
    .from("groups")
    .insert({
      title,
      description,
      category,
      region: region || null,
      max_members: maxMembers,
      creator_nickname: user ? displayName : creatorNickname,
      edit_pin_hash: pin ? hashPin(pin) : null,
      image_url: imageUrl,
      meeting_frequency: meetingFrequency || null,
      meeting_day: meetingDay || null,
      meeting_time: meetingTime || null,
      min_age: minAge,
      max_age: maxAge,
      ...(user ? { owner_id: user.id } : {}),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "저장에 실패했습니다." };
  }

  revalidatePath("/");
  redirect(`/groups/${data.id}?created=1`);
}

export async function updateGroup(
  groupId: string,
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const title = str(form, "title");
  const description = str(form, "description");
  const category = str(form, "category");
  const region = str(form, "region");
  const maxMembers = Number(str(form, "max_members"));
  const pin = pinDigits(form, "edit_pin");
  const meetingFrequency = str(form, "meeting_frequency");
  const meetingDay = str(form, "meeting_day");
  const meetingTime = str(form, "meeting_time");
  const minAgeRaw = str(form, "min_age");
  const maxAgeRaw = str(form, "max_age");
  const minAge = minAgeRaw ? Number(minAgeRaw) : null;
  const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;

  if (title.length < 2 || title.length > 60)
    return { ok: false, error: "모임 이름은 2~60자로 입력해 주세요." };
  if (description.length > 2000)
    return { ok: false, error: "소개글은 2000자 이내로 입력해 주세요." };
  if (!CATEGORY_MAP[category])
    return { ok: false, error: "카테고리를 선택해 주세요." };
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 200)
    return { ok: false, error: "정원은 2~200명으로 입력해 주세요." };
  if (minAge !== null && maxAge !== null && minAge > maxAge)
    return { ok: false, error: "최소 나이가 최대 나이보다 클 수 없어요." };

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  const { data: group, error: fetchErr } = await supabase
    .from("groups")
    .select("edit_pin_hash, owner_id, image_url")
    .eq("id", groupId)
    .single();

  if (fetchErr || !group)
    return { ok: false, error: "모임을 찾을 수 없습니다." };

  const isOwner = user && group.owner_id === user.id;
  if (!isOwner) {
    if (!pin) return { ok: false, error: "PIN을 4자리로 입력해 주세요." };
    if (!group.edit_pin_hash || !verifyPin(pin, group.edit_pin_hash))
      return { ok: false, error: "PIN이 일치하지 않습니다." };
  }

  // 새 이미지가 있으면 업로드, 없으면 기존 유지
  let imageUrl: string | null = group.image_url ?? null;
  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadGroupImage(authClient, imageFile);
  }

  const { error } = await supabase
    .from("groups")
    .update({
      title,
      description,
      category,
      region: region || null,
      max_members: maxMembers,
      image_url: imageUrl,
      meeting_frequency: meetingFrequency || null,
      meeting_day: meetingDay || null,
      meeting_time: meetingTime || null,
      min_age: minAge,
      max_age: maxAge,
    })
    .eq("id", groupId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}?updated=1`);
}

export async function deleteGroup(
  groupId: string,
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const pin = pinDigits(form, "edit_pin");

  // 로그인 사용자이고 owner면 PIN 없이 삭제 가능
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  const { data: group, error: fetchErr } = await supabase
    .from("groups")
    .select("edit_pin_hash, owner_id")
    .eq("id", groupId)
    .single();

  if (fetchErr || !group)
    return { ok: false, error: "모임을 찾을 수 없습니다." };

  const isOwner = user && group.owner_id === user.id;
  if (!isOwner) {
    if (!pin) return { ok: false, error: "PIN을 4자리로 입력해 주세요." };
    if (!group.edit_pin_hash || !verifyPin(pin, group.edit_pin_hash))
      return { ok: false, error: "PIN이 일치하지 않습니다." };
  }

  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  redirect("/?deleted=1");
}

export async function joinGroup(
  groupId: string,
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const nickname = str(form, "nickname");
  const contact = str(form, "contact");
  const message = str(form, "message");

  if (nickname.length < 1 || nickname.length > 20)
    return { ok: false, error: "닉네임은 1~20자로 입력해 주세요." };
  if (contact.length > 100)
    return { ok: false, error: "연락처는 100자 이내로 입력해 주세요." };
  if (message.length > 500)
    return { ok: false, error: "한마디는 500자 이내로 입력해 주세요." };

  const { data: group, error: fetchErr } = await supabase
    .from("groups")
    .select("id, max_members, min_age, max_age")
    .eq("id", groupId)
    .single();
  if (fetchErr || !group)
    return { ok: false, error: "모임을 찾을 수 없습니다." };

  const { count } = await supabase
    .from("memberships")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId);

  if ((count ?? 0) >= group.max_members)
    return { ok: false, error: "정원이 가득 찼습니다." };

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  // 연령 제한 검증
  if ((group.min_age || group.max_age) && user) {
    const { data: profile } = await authClient
      .from("profiles").select("birth_date").eq("id", user.id).single();
    if (!profile?.birth_date)
      return { ok: false, error: "프로필에 생년월일을 입력해야 가입할 수 있어요." };
    const age = new Date().getFullYear() - new Date(profile.birth_date).getFullYear();
    if (group.min_age && age < group.min_age)
      return { ok: false, error: `이 모임은 ${group.min_age}세 이상만 가입할 수 있어요.` };
    if (group.max_age && age > group.max_age)
      return { ok: false, error: `이 모임은 ${group.max_age}세 이하만 가입할 수 있어요.` };
  }

  // 방장이 있는 모임은 pending, 비로그인 모임은 바로 approved
  const { data: groupOwner } = await supabase
    .from("groups").select("owner_id").eq("id", groupId).single();
  const needsApproval = !!groupOwner?.owner_id;

  const { error } = await supabase.from("memberships").insert({
    group_id: groupId,
    nickname,
    contact: contact || null,
    message: message || null,
    status: needsApproval ? "pending" : "approved",
    ...(user ? { user_id: user.id } : {}),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function saveProfile(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const churchName = str(form, "church_name");
  const birthDate = str(form, "birth_date");
  const next = str(form, "next") || "/";

  if (churchName.length < 1 || churchName.length > 50)
    return { ok: false, error: "교회 이름은 1~50자로 입력해 주세요." };
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate))
    return { ok: false, error: "생년월일을 입력해 주세요." };

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await authClient.from("profiles").upsert({
    id: user.id,
    church_name: churchName,
    birth_date: birthDate,
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/my");
  redirect(next);
}

export async function leaveMembership(
  membershipId: string,
  groupId: string,
): Promise<ActionResult> {
  const { error } = await supabase
    .from("memberships")
    .delete()
    .eq("id", membershipId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
  return { ok: true };
}

// 방장 또는 운영자인지 확인하는 헬퍼
async function isManagerOf(userId: string, groupId: string) {
  const { data: group } = await supabase
    .from("groups").select("owner_id").eq("id", groupId).single();
  if (group?.owner_id === userId) return true;
  const { data: m } = await supabase.from("memberships")
    .select("role").eq("group_id", groupId).eq("user_id", userId).eq("status", "approved").maybeSingle();
  return m?.role === "operator";
}

export async function approveMember(
  membershipId: string,
  groupId: string,
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  if (!(await isManagerOf(user.id, groupId)))
    return { ok: false, error: "방장 또는 운영자만 수락할 수 있어요." };

  const { error } = await supabase
    .from("memberships").update({ status: "approved" }).eq("id", membershipId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  return { ok: true };
}

export async function rejectMember(
  membershipId: string,
  groupId: string,
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  if (!(await isManagerOf(user.id, groupId)))
    return { ok: false, error: "방장 또는 운영자만 거절할 수 있어요." };

  const { error } = await supabase
    .from("memberships").delete().eq("id", membershipId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  return { ok: true };
}

export async function createPost(
  groupId: string,
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const content = str(form, "content");
  if (content.length < 1 || content.length > 1000)
    return { ok: false, error: "내용은 1~1000자로 입력해 주세요." };

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const [{ data: group }, { data: membership }] = await Promise.all([
    supabase.from("groups").select("owner_id").eq("id", groupId).single(),
    supabase.from("memberships")
      .select("id, role").eq("group_id", groupId).eq("user_id", user.id).eq("status", "approved").maybeSingle(),
  ]);
  const isOwner = group?.owner_id === user.id;
  const isOperator = membership?.role === "operator";
  if (!isOwner && !membership)
    return { ok: false, error: "모임 멤버만 글을 올릴 수 있어요." };

  // 이미지 업로드
  let imageUrl: string | null = null;
  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadGroupImage(authClient, imageFile);
  }

  const isNotice = (isOwner || isOperator) && form.get("is_notice") === "true";

  const { error } = await authClient.from("group_posts").insert({
    group_id: groupId,
    author_id: user.id,
    content,
    image_url: imageUrl,
    is_notice: isNotice,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function createEvent(
  groupId: string,
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const title = str(form, "title");
  const description = str(form, "description");
  const location = str(form, "location");
  const eventDate = str(form, "event_date");
  const maxAttendees = str(form, "max_attendees");

  if (title.length < 2 || title.length > 60)
    return { ok: false, error: "제목은 2~60자로 입력해 주세요." };
  if (!eventDate)
    return { ok: false, error: "날짜와 시간을 입력해 주세요." };

  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  if (!(await isManagerOf(user.id, groupId)))
    return { ok: false, error: "방장 또는 운영자만 정모를 만들 수 있어요." };

  const { data, error } = await authClient.from("group_events").insert({
    group_id: groupId,
    title,
    description: description || null,
    location: location || null,
    event_date: new Date(eventDate).toISOString(),
    max_attendees: maxAttendees ? Number(maxAttendees) : null,
    created_by: user.id,
  }).select("id").single();

  if (error || !data) return { ok: false, error: error?.message ?? "저장에 실패했습니다." };

  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}`);
}

export async function deleteEvent(
  eventId: string,
  groupId: string,
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await authClient.from("group_events").delete().eq("id", eventId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  return { ok: true };
}

export async function toggleAttendance(
  eventId: string,
  groupId: string,
  isAttending: boolean,
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  if (isAttending) {
    // 참석 취소
    await authClient.from("event_attendees")
      .delete().eq("event_id", eventId).eq("user_id", user.id);
  } else {
    // 참석 등록
    await authClient.from("event_attendees")
      .insert({ event_id: eventId, user_id: user.id });
  }

  revalidatePath(`/groups/${groupId}`);
  return { ok: true };
}

export async function setMemberRole(
  membershipId: string,
  groupId: string,
  role: "member" | "operator",
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  // 방장만 운영자 임명/해제 가능
  const { data: group } = await supabase
    .from("groups").select("owner_id").eq("id", groupId).single();
  if (group?.owner_id !== user.id)
    return { ok: false, error: "방장만 운영자를 임명할 수 있어요." };

  const { error } = await supabase
    .from("memberships").update({ role }).eq("id", membershipId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  return { ok: true };
}

export async function reportGroup(
  groupId: string,
  reason: string,
): Promise<ActionResult> {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await authClient.from("reports").insert({
    reporter_id: user.id,
    group_id: groupId,
    reason,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
