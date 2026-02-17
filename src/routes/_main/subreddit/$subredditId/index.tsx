import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/functions/post";

export const getSubredditPostsOptions = (subredditId: string) => {
  return queryOptions({
    queryKey: ["posts", { subredditId }],
    queryFn: () => getPosts({ data: { subredditId } }),
  });
};

export const Route = createFileRoute("/_main/subreddit/$subredditId/")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      getSubredditPostsOptions(params.subredditId),
    );
  },
});

function RouteComponent() {
  const { subredditId } = Route.useParams();
  const { data } = useSuspenseQuery(getSubredditPostsOptions(subredditId));

  return (
    <div className="flex justify-center py-8">
      <div className="flex flex-col gap-4 w-full max-w-3xl px-4">
        {data.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
