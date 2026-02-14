import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh h-full flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-72 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
