import { Field } from "@base-ui/react/field";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSubredditSchema } from "@/validations/subreddit";

function CreateSubreddit() {
  const form = useForm({
    defaultValues: { name: "", description: "" },
    onSubmit: ({ value: formValues }) => {
      console.log("Form values:", formValues);
    },
    validators: {
      onChange: createSubredditSchema,
    },
  });

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label render={<Label htmlFor={field.name}>Name</Label>} />
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter subreddit name"
              />
              <Field.Error
                className="text-destructive text-sm"
                match={!field.state.meta.isValid}
              >
                {field.state.meta.errors[0]?.message}
              </Field.Error>
            </div>
          </Field.Root>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label
                render={<Label htmlFor={field.name}>Description</Label>}
              />
              <Textarea
                id={field.name}
                placeholder="Enter subreddit description"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <Field.Error
                className="text-destructive text-sm"
                match={!field.state.meta.isValid}
              >
                {field.state.meta.errors[0]?.message}
              </Field.Error>
            </div>
          </Field.Root>
        )}
      />

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {(state) => (
          <Button type="submit" className="w-full" disabled={!state.canSubmit}>
            {state.isSubmitting ? "Creating subreddit..." : "Create Subreddit"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default CreateSubreddit;
