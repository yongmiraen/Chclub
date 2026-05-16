import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "./SignOutButton";

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white active:bg-amber-800"
      >
        로그인
      </Link>
    );
  }

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "회원";

  const avatar =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div className="flex items-center gap-2">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={name} className="h-7 w-7 rounded-full object-cover ring-1 ring-stone-200" />
      ) : (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
          {name[0]}
        </span>
      )}
      <SignOutButton />
    </div>
  );
}
