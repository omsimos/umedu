/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod/v4";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SendHorizonalIcon, XIcon } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { useAppForm } from "@/hooks/form";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TagsSelection } from "./components/tags-selection";
import { getTagsQuery } from "@/lib/queries";

const messageSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must be at least 3 characters" })
    .max(300, { error: "Title must not exceed 300 characters" }),
  content: z
    .string()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(20000, { error: "Message must not exceed 20,000 characters" }),
  tags: z.array(z.string()).max(3, { error: "You can select up to 3 tags" }),
});

export default function SubmitPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: tags } = useQuery(getTagsQuery);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof messageSchema>) => {
      return fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          tags: values.tags,
        }),
      });
    },
    onSuccess: () => {
      toast.success("Message posted successfully!");
      router.push("/forum");
    },
    onError: (error) => {
      console.error("Error posting message:", error);
      toast.error("Failed to post message. Please try again.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      content: "",
      tags: [] as string[],
    },
    validators: {
      onSubmit: messageSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="space-y-6 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="title"
        children={(field) => (
          <field.TextField
            isRequired
            disabled={mutation.isPending}
            label="Title"
            placeholder="Enter a title for your message"
          />
        )}
      />

      <form.AppField
        name="tags"
        children={(field) => {
          const selectedTags = field.state.value;

          return (
            <div>
              <Label className="h-7">Tags</Label>

              <div className="flex flex-wrap gap-2 mb-2">
                {tags && selectedTags.length > 0 ? (
                  selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;

                    return (
                      <Badge key={tagId} variant="secondary">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() =>
                            field.handleChange(
                              selectedTags.filter((id) => id !== tagId),
                            )
                          }
                          disabled={mutation.isPending}
                        >
                          <XIcon size={12} />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm">
                    No tags selected
                  </span>
                )}
                <TagsSelection
                  disabled={mutation.isPending || !tags}
                  onTagsChange={field.handleChange}
                  selectedTags={field.state.value}
                />
              </div>
            </div>
          );
        }}
      />

      <form.AppField
        name="content"
        children={(field) => (
          <field.TextareaField
            isRequired
            disabled={mutation.isPending}
            className="min-h-[200px]"
            label="Message"
            placeholder="What's on your mind? Your identity will remain anonymous."
          />
        )}
      />

      <div className="flex justify-end">
        <form.AppForm>
          <form.SubmitButton
            disabled={mutation.isPending}
            label="Post Anonymously"
            icon={SendHorizonalIcon}
          />
        </form.AppForm>
      </div>
    </form>
  );
}
