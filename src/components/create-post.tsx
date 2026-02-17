import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Field } from "@base-ui/react/field";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema } from "@/validations/post";
import { getSubreddits as getSubredditsFn } from "@/functions/subreddit";

function CreatePost() {
  const getSubreddits = useServerFn(getSubredditsFn);
  const form = useForm({
    defaultValues: {
      subredditId: "",
      title: "",
      content: "",
    },
    onSubmit: ({ value: formValues }) => {
      console.log("Form values:", formValues);
    },
    validators: {
      onChange: createPostSchema,
    },
  });

  const { data: subreddits } = useSuspenseQuery({
    queryKey: ["subreddits"],
    queryFn: () => getSubreddits(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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
        name="subredditId"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label render={<div />} nativeLabel={false}>
                Subreddit
              </Field.Label>
              <Combobox
                id={field.name}
                name={field.name}
                value={subreddits.find(
                  (subreddit) => subreddit.id === field.state.value,
                )}
                onValueChange={(value) => field.handleChange(value?.id ?? "")}
                items={subreddits}
                itemToStringLabel={(item) => item.name}
                itemToStringValue={(item) => item.id}
              >
                <ComboboxInput placeholder="Select a subreddit" />
                <ComboboxContent>
                  <ComboboxList>
                    {(subreddit) => (
                      <ComboboxItem key={subreddit.id} value={subreddit}>
                        {subreddit.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
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
        name="title"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label render={<Label htmlFor={field.name}>Title</Label>} />
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter post title"
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
        name="content"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label
                render={<Label htmlFor={field.name}>Content</Label>}
              />
              <Textarea
                id={field.name}
                placeholder="Enter post content"
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
            {state.isSubmitting ? "Creating post..." : "Create Post"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default CreatePost;
