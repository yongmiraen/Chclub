import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TopBar from "@/components/TopBar";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "프로필 수정 · 크로소" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/my/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("church_name, birth_date")
    .eq("id", user.id)
    .single();

  return (
    <>
      <TopBar title="프로필 수정" back="/my" />
      <ProfileForm
        churchName={profile?.church_name ?? ""}
        birthDate={profile?.birth_date ?? ""}
      />
    </>
  );
}
