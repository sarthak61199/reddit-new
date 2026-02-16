import { Field } from "@base-ui/react/field";
import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSubredditSchema } from "@/validations/subreddit";
import { createSubreddit as createSubredditFn } from "@/functions/subreddit";

function CreateSubreddit() {
  const createSubreddit = useServerFn(createSubredditFn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createSubreddit,
    onSuccess: ({ id }) => {
      navigate({ to: "/subreddit/$subredditId", params: { subredditId: id } });
      queryClient.invalidateQueries({ queryKey: ["subreddits"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: { name: "", description: "" },
    onSubmit: ({ value: formValues }) => {
      mutate(
        {
          data: {
            name: formValues.name,
            description: formValues.description,
          },
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
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
