"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
import { MessageForm } from "./message-form";
import { MessageCirclePlusIcon } from "lucide-react";

export function PostMessage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
          <MessageForm />
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
          <MessageForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
