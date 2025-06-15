/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod/v4";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SendHorizonalIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function SubmitPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: { title: string; content: string }) => {
      return fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
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
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="space-y-4 w-full"
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
            label="Title"
            placeholder="Enter a title for your message"
          />
        )}
      />
      <form.AppField
        name="content"
        children={(field) => (
          <field.TextareaField
            isRequired
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
