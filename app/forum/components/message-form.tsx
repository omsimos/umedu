/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod/v4";
import { SendHorizonalIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "@/hooks/form";

const messageSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must be at least 3 characters" })
    .max(300, { error: "Title must not exceed 300 characters" }),
  content: z
    .string()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(20000, { error: "Message must not exceed 20000 characters" }),
});

type Props = {
  handleAddPost: (value: {
    title: string;
    content: string;
  }) => Promise<Promise<void> | undefined>;
};

export function MessageForm({ handleAddPost }: Props) {
  const mutation = useMutation({
    mutationFn: async (value: { title: string; content: string }) => {
      await handleAddPost(value);
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      content: "",
    },
    validators: {
      onSubmit: messageSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
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
        name="content"
        children={(field) => (
          <field.TextareaField
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
