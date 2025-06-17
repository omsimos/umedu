export function CharacterCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = current > max;

  return (
    <div className="text-sm ml-auto">
      <span
        className={`${isOverLimit ? "text-destructive" : isNearLimit ? "text-yellow-600" : "text-muted-foreground"}`}
      >
        {current.toLocaleString()}/{max.toLocaleString()}
      </span>
    </div>
  );
}
