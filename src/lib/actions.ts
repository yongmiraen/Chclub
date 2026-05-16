"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
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

  if (title.length < 2 || title.length > 60)
    return { ok: false, error: "모임 이름은 2~60자로 입력해 주세요." };
  if (description.length > 2000)
    return { ok: false, error: "소개글은 2000자 이내로 입력해 주세요." };
  if (!CATEGORY_MAP[category])
    return { ok: false, error: "카테고리를 선택해 주세요." };
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 200)
    return { ok: false, error: "정원은 2~200명으로 입력해 주세요." };
  if (creatorNickname.length < 1 || creatorNickname.length > 20)
    return { ok: false, error: "닉네임은 1~20자로 입력해 주세요." };
  if (!pin)
    return { ok: false, error: "수정용 PIN은 숫자 4자리로 입력해 주세요." };
  if (region.length > 30)
    return { ok: false, error: "지역은 30자 이내로 입력해 주세요." };

  const { data, error } = await supabase
    .from("groups")
    .insert({
      title,
      description,
      category,
      region: region || null,
      max_members: maxMembers,
      creator_nickname: creatorNickname,
      edit_pin_hash: hashPin(pin),
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

  if (!pin) return { ok: false, error: "PIN을 4자리로 입력해 주세요." };
  if (title.length < 2 || title.length > 60)
    return { ok: false, error: "모임 이름은 2~60자로 입력해 주세요." };
  if (description.length > 2000)
    return { ok: false, error: "소개글은 2000자 이내로 입력해 주세요." };
  if (!CATEGORY_MAP[category])
    return { ok: false, error: "카테고리를 선택해 주세요." };
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 200)
    return { ok: false, error: "정원은 2~200명으로 입력해 주세요." };

  const { data: group, error: fetchErr } = await supabase
    .from("groups")
    .select("edit_pin_hash")
    .eq("id", groupId)
    .single();

  if (fetchErr || !group)
    return { ok: false, error: "모임을 찾을 수 없습니다." };
  if (!verifyPin(pin, group.edit_pin_hash))
    return { ok: false, error: "PIN이 일치하지 않습니다." };

  const { error } = await supabase
    .from("groups")
    .update({
      title,
      description,
      category,
      region: region || null,
      max_members: maxMembers,
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
  if (!pin) return { ok: false, error: "PIN을 4자리로 입력해 주세요." };

  const { data: group, error: fetchErr } = await supabase
    .from("groups")
    .select("edit_pin_hash")
    .eq("id", groupId)
    .single();

  if (fetchErr || !group)
    return { ok: false, error: "모임을 찾을 수 없습니다." };
  if (!verifyPin(pin, group.edit_pin_hash))
    return { ok: false, error: "PIN이 일치하지 않습니다." };

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
    .select("id, max_members")
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

  const { error } = await supabase.from("memberships").insert({
    group_id: groupId,
    nickname,
    contact: contact || null,
    message: message || null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
  return { ok: true };
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
