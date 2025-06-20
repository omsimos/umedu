import { Button } from "@/components/ui/button";
import { AVAILABLE_TAGS } from "@/lib/constants";

type Props = {
  toggleTag: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  tempSelectedTags: string[];
};

export function SelectTags({
  toggleTag,
  onSave,
  onCancel,
  tempSelectedTags,
}: Props) {
  return (
    <div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = tempSelectedTags.includes(tag);
            const canSelect = tempSelectedTags.length < 3 || isSelected;

            return (
              <Button
                key={tag}
                type="button"
                variant={isSelected ? "secondary" : "outline"}
                onClick={() => toggleTag(tag)}
                disabled={!canSelect && !isSelected}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
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
