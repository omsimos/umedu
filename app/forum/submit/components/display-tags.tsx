import { Tag } from "@/db/schema";
import { Button } from "@/components/ui/button";

type Props = {
  tags: Array<Tag>;
  toggleTag: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  tempSelectedTags: string[];
};

export function DisplayTags({
  tags,
  toggleTag,
  onSave,
  onCancel,
  tempSelectedTags,
}: Props) {
  return (
    <div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => {
            const isSelected = tempSelectedTags.includes(tag.id);
            const canSelect = tempSelectedTags.length < 3 || isSelected;

            return (
              <Button
                key={tag.id}
                type="button"
                variant={isSelected ? "secondary" : "outline"}
                onClick={() => toggleTag(tag.id)}
                disabled={!canSelect && !isSelected}
              >
                {tag.name}
              </Button>
            );
          })}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onSave} className="flex-1">
            Save Tags ({tempSelectedTags.length})
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
