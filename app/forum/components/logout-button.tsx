"use client";

import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="button"
      disabled={pending}
      className="grid place-items-center"
    >
      {pending ? (
        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
      ) : (
        <LogOutIcon className="size-5" />
      )}
    </button>
  );
}
