import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/subreddit/$subredditId/post/$postId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/$subredditId/post/$postId/"!</div>
}
