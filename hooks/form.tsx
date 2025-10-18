import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { LucideIcon } from "lucide-react";
import { CharacterCounter } from "@/components/character-counter";
import { LoadingIcon } from "@/components/loading-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

function TextField({
  label,
  isRequired,
  ...props
}: { label: string; isRequired?: boolean } & React.ComponentProps<"input">) {
  const field = useFieldContext<string>();

  return (
    <div>
      <Label htmlFor={field.name} className="h-7">
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <Input
        {...props}
        id={field.name}
        value={field.state.value}
        onChange={(e) =>
          field.handleChange(e.target.value.replace(/\s+/g, " "))
        }
      />

      <div className="mt-1 flex items-center justify-between">
        {field.state.meta.errors.length > 0 && (
          <p className="text-sm text-destructive">
            {field.state.meta.errors[0].message}
          </p>
        )}

        <CharacterCounter current={field.state.value.length} max={300} />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  isRequired,
  ...props
}: { label: string; isRequired?: boolean } & React.ComponentProps<"textarea">) {
  const field = useFieldContext<string>();

  return (
    <div>
      <Label htmlFor={field.name} className="h-7">
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        {...props}
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />

      <div className="mt-1 flex items-center justify-between">
        {field.state.meta.errors.length > 0 && (
          <p className="text-sm text-destructive">
            {field.state.meta.errors[0].message}
          </p>
        )}

        <CharacterCounter current={field.state.value.length} max={20000} />
      </div>
    </div>
  );
}

function SubmitButton({
  label,
  icon,
  disabled,
  ...props
}: { label: string; icon?: LucideIcon } & React.ComponentProps<"button">) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button disabled={isSubmitting || !canSubmit || disabled} {...props}>
          {label}
          <LoadingIcon icon={icon} loading={isSubmitting || !!disabled} />
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
