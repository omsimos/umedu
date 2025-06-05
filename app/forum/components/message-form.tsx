/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod";
import { SendHorizonalIcon } from "lucide-react";
import { useAppForm } from "@/hooks/form";
import { submitPost } from "@/actions/message";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const messageSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(300, { message: "Title must not exceed 300 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(20000, { message: "Message must not exceed 20000 characters" }),
});

type Props = {
  onComplete?: () => void;
};

export function MessageForm({ onComplete }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: { title: string; content: string }) => {
      return submitPost(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Message posted successfully!");
      onComplete?.();
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      message: "",
    },
    validators: {
      onSubmit: messageSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        mutation.mutate({ title: value.title, content: value.message });
      } catch (error) {
        console.error("Error posting message:", error);
        toast.error("Failed to post message. Please try again.");
      }
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
        name="message"
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
            label="Post Anonymously"
            icon={SendHorizonalIcon}
          />
        </form.AppForm>
      </div>
    </form>
  );
}
