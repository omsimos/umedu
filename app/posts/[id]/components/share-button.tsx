"use client";

import { Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { truncateContent } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  title: string;
  content: string;
};

export function ShareButton({ title, content }: Props) {
  const share = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const shareData: ShareData = {
        title,
        url,
        text: truncateContent(content),
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
