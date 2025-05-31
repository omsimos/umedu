/* eslint-disable react/no-children-prop */
"use client";

import { z } from "zod";
import { SendHorizonalIcon } from "lucide-react";
import { useAppForm } from "@/hooks/form";

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
