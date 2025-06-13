"use client";

import { toast } from "sonner";
import { useCallback, useState } from "react";
import { MessageCirclePlusIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { asyncRateLimit } from "@tanstack/react-pacer/async-rate-limiter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { addPost } from "@/actions/post";
import { MessageForm } from "./message-form";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export function PostMessage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rateLimitedAddPost = useCallback(
    asyncRateLimit(
      async (value: { title: string; content: string }) => {
        await addPost(value);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Message posted successfully!");
        setOpen(false);
      },
      {
        limit: 2, // max 2 requests
        window: 1000 * 60, // per minute
        onReject: (rateLimiter) => {
          console.warn("Rate limit exceeded. Please try again later.");
          toast.error(
            `You are posting too frequently. Try again in ${Math.ceil(rateLimiter.getMsUntilNextWindow() / 1000)} seconds.`,
          );
        },
      },
    ),
    [],
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <MessageCirclePlusIcon className="size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader hidden>
            <DialogTitle>Post an Anonymous Message</DialogTitle>
            <DialogDescription>What&apos;s on your mind?</DialogDescription>
          </DialogHeader>
          <MessageForm handleAddPost={rateLimitedAddPost} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <MessageCirclePlusIcon className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <DrawerHeader hidden className="text-left">
          <DrawerTitle>Post an Anonymous Message</DrawerTitle>
          <DrawerDescription>What&apos;s on your mind?</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <MessageForm handleAddPost={rateLimitedAddPost} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
