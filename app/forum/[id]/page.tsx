import { Separator } from "@/components/ui/separator";
import { Post } from "@/db/schema";
import { format, fromUnixTime } from "date-fns";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="text-muted-foreground text-sm">
        Posted at {format(fromUnixTime(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
      </p>
      <Separator className="my-4" />
      <p className="font-medium text-secondary-foreground">{post.content}</p>
    </div>
  );
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`,
    {
      cache: "force-cache",
      next: {
        tags: [`post-${id}`],
      },
    },
  );

  if (!res.ok) notFound();

  return res.json();
}
