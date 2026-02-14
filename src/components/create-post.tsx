import { Field } from "@base-ui/react/field";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema } from "@/validations/post";

const subreddits = [
  { value: "1", label: "test" },
  { value: "2", label: "test2" },
  { value: "3", label: "test3" },
  { value: "4", label: "test4" },
  { value: "5", label: "test5" },
  { value: "6", label: "test6" },
  { value: "7", label: "test7" },
  { value: "8", label: "test8" },
  { value: "9", label: "test9" },
  { value: "10", label: "test10" },
];

function CreatePost() {
  const form = useForm({
    defaultValues: { subredditId: "", title: "", content: "" },
    onSubmit: ({ value: formValues }) => {
      console.log("Form values:", formValues);
    },
    validators: {
      onChange: createPostSchema,
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
        name="subredditId"
        children={(field) => (
          <Field.Root
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
          >
            <div className="space-y-2">
              <Field.Label
                render={<Label htmlFor={field.name}>Subreddit</Label>}
              />
              <Select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value || "")}
                items={subreddits}
              >
                <SelectTrigger onBlur={field.handleBlur} className="w-full">
                  <SelectValue placeholder="Select a subreddit" />
                </SelectTrigger>
                <SelectContent>
                  {subreddits.map((subreddit) => (
                    <SelectItem key={subreddit.value} value={subreddit.value}>
                      {subreddit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
