import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/functions/post";

export const getPostsOptions = () => {
  return queryOptions({
    queryKey: ["posts"],
    queryFn: () => getPosts({ data: {} }),
  });
};

export const Route = createFileRoute("/_main/")({
  component: App,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getPostsOptions());
  },
});

function App() {
  const { data } = useSuspenseQuery(getPostsOptions());

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
