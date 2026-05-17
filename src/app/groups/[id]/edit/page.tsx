import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase-server";
import { updateGroup } from "@/lib/actions";
import GroupForm from "@/components/GroupForm";
import DeleteGroupButton from "@/components/DeleteGroupButton";
import type { Group } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: group }, { data: { user } }] = await Promise.all([
    supabase.from("groups").select("*").eq("id", id).single<Group>(),
    supabase.auth.getUser(),
  ]);

  if (!group) notFound();

  const isOwner = user && (group as Group & { owner_id?: string }).owner_id === user.id;
  const boundUpdate = updateGroup.bind(null, group.id);

  return (
    <>
      <TopBar title="모임 수정" back={`/groups/${group.id}`} />
      <div className="px-5 py-5">
        {!isOwner && (
          <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs leading-5 text-stone-600">
            만들 때 정한 PIN 번호를 입력하면 저장할 수 있어요.
          </p>
        )}
        <div className={isOwner ? "" : "mt-5"}>
          <GroupForm
            action={boundUpdate}
            mode="edit"
            defaults={{
              title: group.title,
              description: group.description,
              category: group.category,
              region: group.region ?? "",
              max_members: group.max_members,
              image_url: group.image_url ?? undefined,
              meeting_frequency: group.meeting_frequency ?? undefined,
              meeting_day: group.meeting_day ?? undefined,
              meeting_time: group.meeting_time ?? undefined,
            }}
            submitLabel="저장해요"
            hidePin={!!isOwner}
          />
        </div>
        <div className="mt-6">
          <DeleteGroupButton groupId={group.id} isOwner={!!isOwner} />
        </div>
      </div>
    </>
  );
}
