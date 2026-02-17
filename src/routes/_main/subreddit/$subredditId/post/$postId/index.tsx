import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";
import { getPost } from "@/functions/post";

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", postId],
    queryFn: () => getPost({ data: { id: postId } }),
  });

export const Route = createFileRoute(
  "/_main/subreddit/$subredditId/post/$postId/",
)({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(postQueryOptions(params.postId));
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-3xl px-4">
        <PostCard post={post} />
      </div>
    </div>
  );
}
