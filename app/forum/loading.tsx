import { PostCardSkeleton } from "./components/post-card-skeleton";

export default function ForumLoading() {
  return (
    <div className="w-full mx-auto space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
