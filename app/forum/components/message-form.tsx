/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod";
import { useState } from "react";
import { SendHorizonalIcon, XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppForm } from "@/hooks/form";
import { Label } from "@/components/ui/label";

const AVAILABLE_TAGS = [
  "Academics",
  "Campus Life",
  "Events",
  "Questions",
  "Resources",
  "Clubs",
  "Sports",
  "Career",
  "Technology",
  "Health",
];

const messageSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, { message: "Title must not exceed 50 characters" }),
  message: z
    .string()
    .max(2000, { message: "Caption must not exceed 2000 characters" }),
});

export function MessageForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      message: "",
    },
    validators: {
      onSubmit: messageSchema,
    },
    onSubmit: async () => {},
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Post an Anonymous Message</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          <form.AppField
            name="title"
            children={(field) => (
              <field.TextField
                label="Title"
                placeholder="Enter a title for your message"
              />
            )}
          />
          <form.AppField
            name="message"
            children={(field) => (
              <field.TextareaField
                label="Message"
                placeholder="What's on your mind? Your identity will remain anonymous."
              />
            )}
          />

          <div className="space-y-2">
            <Label className="h-7">Tags (select up to 3)</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Tags:</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1">
                    {tag}
                    <XIcon
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <form.AppForm>
            <form.SubmitButton
              label="Post Anonymously"
              icon={SendHorizonalIcon}
            />
          </form.AppForm>
        </CardFooter>
      </form>
    </Card>
  );
}
