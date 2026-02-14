import { Outlet, createFileRoute } from "@tanstack/react-router";
import Logo from "@/components/logo";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="h-svh flex flex-col">
      <header className="h-20 border-b">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>
      <main className="flex-1 grid place-items-center">
        <Outlet />
      </main>
    </main>
  );
}
