"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  LightbulbIcon,
  SendHorizonalIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import { getTagsQuery } from "@/lib/queries";
import { TagsSelection } from "./components/tags-selection";

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

  const postingTips = [
    {
      title: "Lead with context",
      description:
        "Share just enough detail so peers can quickly understand the situation.",
      icon: LightbulbIcon,
    },
    {
      title: "Ask one clear question",
      description:
        "Let people know how they can help - advice, resources, or a vibe check.",
      icon: SparklesIcon,
    },
  ];

  const safetyChecklist = [
    {
      title: "Protect identities",
      description:
        "Skip names, classes, or any info that could point to a specific person.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Keep it kind",
      description:
        "We moderate for empathy and respect - critique ideas, not people.",
      icon: SparklesIcon,
    },
  ];

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
    <section className="space-y-4 w-[70vw] pb-20">
      <Link href="/forum" className="mb-4">
        <ArrowLeftIcon className="text-zinc-600 hover:opacity-65 transition-opacity  z-50" />
      </Link>
      <div className="mt-4 relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-transparent p-6 shadow-sm dark:from-zinc-900">
        <div className="space-y-3">
          <Badge variant="secondary" className="w-fit uppercase text-xs">
            Submit anonymously
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Give your story the care it deserves.
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            A thoughtful title and a little context go a long way. Your post is
            only visible to other students, and your identity stays hidden.
          </p>
        </div>
      </div>

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <form
          className="space-y-4 w-full rounded-3xl border bg-card/80 p-6 shadow-sm"
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
                placeholder="Give folks a quick headline to skim"
              />
            )}
          />

          <form.AppField
            name="tags"
            children={(field) => {
              const selectedTags = field.state.value;

              return (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Label className="h-7">Tags</Label>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => field.handleChange([])}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                        disabled={mutation.isPending}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pick up to 3 tags so the right people find your post faster.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tags && selectedTags.length > 0 ? (
                      selectedTags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;

                        return (
                          <Badge
                            key={tagId}
                            variant="secondary"
                            className="inline-flex items-center gap-2"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() =>
                                field.handleChange(
                                  selectedTags.filter((id) => id !== tagId),
                                )
                              }
                              disabled={mutation.isPending}
                              aria-label={`Remove ${tag.name} tag`}
                              className="inline-flex size-5 items-center justify-center rounded-full bg-black/10 text-muted-foreground transition hover:bg-black/20 disabled:opacity-40 dark:bg-white/10 dark:hover:bg-white/20"
                            >
                              <XIcon size={12} />
                            </button>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No tags yet - add a few for quicker discovery.
                      </span>
                    )}
                  </div>

                  {!tags && (
                    <p className="text-xs text-muted-foreground">
                      Fetching available tags...
                    </p>
                  )}

                  <TagsSelection
                    disabled={mutation.isPending || !tags}
                    onTagsChange={field.handleChange}
                    selectedTags={field.state.value}
                  />
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
                className="min-h-[260px]"
                label="Message"
                placeholder="Tell your story, ask questions, or get something off your chest."
              />
            )}
          />

          <form.AppForm>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => router.push("/forum")}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <form.SubmitButton
                disabled={mutation.isPending}
                label="Post Anonymously"
                icon={SendHorizonalIcon}
                className="w-full sm:w-auto"
              />
            </div>
          </form.AppForm>
        </form>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posting tips</CardTitle>
              <CardDescription>
                These prompts keep responses helpful and quick.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {postingTips.map(({ title, description, icon: Icon }) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Care checklist</CardTitle>
              <CardDescription>
                A quick reminder before you hit submit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {safetyChecklist.map(({ title, description, icon: Icon }) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 inline-flex size-9 items-center justify-center rounded-full border text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
