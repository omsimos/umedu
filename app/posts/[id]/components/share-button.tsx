"use client";

import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export function ShareButton({ title }: Props) {
  const share = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const shareData: ShareData = {
        title,
        url,
      };

      try {
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        }
      } catch (err) {
        console.error("Failed to share: ", err);
      }
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={share}>
      <Share2Icon />
    </Button>
  );
}
