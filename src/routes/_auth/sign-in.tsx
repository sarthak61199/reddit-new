import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Field } from "@base-ui/react/field";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8),
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({ to: "/" });
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    },
  });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <Field.Root
              name={field.name}
              invalid={!field.state.meta.isValid}
              dirty={field.state.meta.isDirty}
              touched={field.state.meta.isTouched}
            >
              <div className="space-y-2">
                <Field.Label
                  nativeLabel={false}
                  render={<Label>Email</Label>}
                />
                <Input
                  type="email"
                  placeholder="name@example.com"
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
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Field.Root
              name={field.name}
              invalid={!field.state.meta.isValid}
              dirty={field.state.meta.isDirty}
              touched={field.state.meta.isTouched}
            >
              <div className="space-y-2">
                <Field.Label
                  nativeLabel={false}
                  render={<Label>Password</Label>}
                />
                <Input
                  type="password"
                  placeholder="Enter your password"
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
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit}
            >
              {state.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="text-center text-sm flex items-center justify-center gap-1">
        <span className="text-muted-foreground">Don't have an account?</span>
        <Link
          to="/sign-up"
          className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
