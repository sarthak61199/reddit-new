import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({ component: App });

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
