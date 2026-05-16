import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import { supabase } from "@/lib/supabase";
import { updateGroup } from "@/lib/actions";
import GroupForm from "@/components/GroupForm";
import DeleteGroupButton from "@/components/DeleteGroupButton";
import type { Group } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: group } = await supabase
    .from("groups").select("*").eq("id", id).single<Group>();

  if (!group) notFound();

  const boundUpdate = updateGroup.bind(null, group.id);

  return (
    <>
      <TopBar title="모임 수정" back={`/groups/${group.id}`} />
      <div className="px-5 py-5">
        <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs leading-5 text-stone-600">
          만들 때 정한 PIN 번호를 입력하면 저장할 수 있어요.
        </p>
        <div className="mt-5">
          <GroupForm
            action={boundUpdate}
            mode="edit"
            defaults={{
              title: group.title,
              description: group.description,
              category: group.category,
              region: group.region ?? "",
              max_members: group.max_members,
            }}
            submitLabel="저장해요"
          />
        </div>
        <div className="mt-6">
          <DeleteGroupButton groupId={group.id} />
        </div>
      </div>
    </>
  );
}
