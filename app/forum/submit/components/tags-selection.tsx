"use client";

import { toast } from "sonner";
import { useState } from "react";
import { TagIcon } from "lucide-react";
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
import { Tag } from "@/db/schema";
import { DisplayTags } from "./display-tags";

type Props = {
  tags?: Array<Tag>;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
};

export function TagsSelection({
  tags,
  selectedTags,
  onTagsChange,
  disabled,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [tempSelectedTags, setTempSelectedTags] =
    useState<string[]>(selectedTags);

  const toggleTag = (tagId: string) => {
    if (tempSelectedTags.includes(tagId)) {
      setTempSelectedTags(tempSelectedTags.filter((id) => id !== tagId));
    } else if (tempSelectedTags.length < 3) {
      setTempSelectedTags([...tempSelectedTags, tagId]);
    } else {
      toast.error("You can select up to 3 tags");
    }
  };

  const handleSave = () => {
    onTagsChange(tempSelectedTags);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedTags(selectedTags);
    setIsOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full"
            onClick={() => setTempSelectedTags(selectedTags)}
          >
            <TagIcon />
            Add Tags ({selectedTags.length}/3)
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Tags</DialogTitle>
            <DialogDescription>
              Choose up to 3 tags that best describe your post. Selected:{" "}
              {tempSelectedTags.length}/3
            </DialogDescription>
          </DialogHeader>
          {tags && (
            <DisplayTags
              tags={tags}
              toggleTag={toggleTag}
              onSave={handleSave}
              onCancel={handleCancel}
              tempSelectedTags={tempSelectedTags}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full"
          onClick={() => setTempSelectedTags(selectedTags)}
        >
          <TagIcon />
          Add Tags ({selectedTags.length}/3)
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Tags</DrawerTitle>
          <DrawerDescription>
            Choose up to 3 tags that best describe your post. Selected:{" "}
            {tempSelectedTags.length}/3
          </DrawerDescription>
        </DrawerHeader>
        {tags && (
          <DisplayTags
            tags={tags}
            toggleTag={toggleTag}
            onSave={handleSave}
            onCancel={handleCancel}
            tempSelectedTags={tempSelectedTags}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
