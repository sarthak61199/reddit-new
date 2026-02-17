import { Link } from "@tanstack/react-router";
import { MessageSquare, User } from "lucide-react";
import { useMutation, useQueryClient, useSuspenseQuery  } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { postQueryOptions } from "@/routes/_main/subreddit/$subredditId/post/$postId/index";
import { Button } from "@/components/ui/button";
import Voting from "@/components/voting";
import { votePost as votePostFn } from "@/functions/post";

interface PostCardProps {
  postId: string;
}

export function PostCard({ postId }: PostCardProps) {
  const queryClient = useQueryClient();
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const votePost = useServerFn(votePostFn);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { mutate } = useMutation({
    mutationFn: votePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="w-full">
      <div className="flex">
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link
                to="/subreddit/$subredditId"
                params={{ subredditId: post.subreddit.id }}
                className="font-semibold text-foreground hover:underline"
              >
                {post.subreddit.name}
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.creator.name}
              </span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <CardTitle className="mt-2 text-xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {post.content}
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Voting
                onVote={(type) => {
                  mutate({ data: { postId, type } });
                }}
                voteCount={post.voteCount}
                userVote={post.userVote}
              />
              <Button variant="ghost">
                <MessageSquare className="size-4" />
                <span>{post.commentCount} Comments</span>
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
