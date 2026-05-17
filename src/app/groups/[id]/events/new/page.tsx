import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TopBar from "@/components/TopBar";
import EventForm from "./EventForm";
import type { Group } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "정모 만들기 · 크로소" };

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: group }, { data: { user } }] = await Promise.all([
    supabase.from("groups").select("*").eq("id", id).single<Group>(),
    supabase.auth.getUser(),
  ]);

  if (!group) notFound();

  const isOwner = user && (group as Group & { owner_id?: string }).owner_id === user.id;
  if (!isOwner) redirect(`/groups/${id}`);

  return (
    <>
      <TopBar title="정모 만들기" back={`/groups/${id}`} />
      <EventForm groupId={id} />
    </>
  );
}
