import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/subreddit/$subredditId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/$subredditId/"!</div>
}
