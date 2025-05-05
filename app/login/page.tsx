import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Button
        className="rounded-full shadow-none bg-white h-[40px] px-3 font-medium text-base border border-muted text-[#1F1F1F] hover:text-[#1F1F1F] hover:bg-gray-50"
        asChild
      >
        <Link href="/auth/google">
          <LogInIcon className="size-5" />
          Sign in with Google
        </Link>
      </Button>
    </div>
  );
}
