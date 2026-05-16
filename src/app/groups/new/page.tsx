import TopBar from "@/components/TopBar";
import GroupForm from "@/components/GroupForm";
import { createGroup } from "@/lib/actions";

export const metadata = { title: "모임 만들기 · 크로소" };

export default function NewGroupPage() {
  return (
    <>
      <TopBar title="모임 만들기" back="/" />
      <div className="px-5 py-5">
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          모임 링크와 PIN 번호는 따로 적어두세요. 나중에 수정·삭제할 때 필요해요.
        </p>
        <div className="mt-5">
          <GroupForm action={createGroup} mode="create" submitLabel="모임 만들기" />
        </div>
      </div>
    </>
  );
}
