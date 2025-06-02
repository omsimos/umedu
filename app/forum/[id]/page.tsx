import { Post } from "@/db/schema";
import { notFound } from "next/navigation";
import { PostCard } from "../components/post-card";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="w-full mx-auto p-4">
      <PostCard post={post} />
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
