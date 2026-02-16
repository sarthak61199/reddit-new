import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateSubreddit from "@/components/create-subreddit";
import { getSubreddits as getSubredditsFn } from "@/functions/subreddit";
import { Spinner } from "@/components/ui/spinner";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-20 border-t h-full w-72 bg-background border-r border-border overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Subreddits</h2>
          <Dialog>
            <DialogTrigger
              render={
                <Button className="cursor-pointer" size={"icon-sm"}>
                  <Plus />
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Subreddit</DialogTitle>
              </DialogHeader>
              <CreateSubreddit />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            }
          >
            <SubredditList />
          </Suspense>
        </div>
      </div>
    </aside>
  );
}

export function SubredditList() {
  const getSubreddits = useServerFn(getSubredditsFn);
  const { data: subreddits } = useSuspenseQuery({
    queryKey: ["subreddits"],
    queryFn: () => getSubreddits(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return (
    <>
      {subreddits.map((subreddit) => (
        <Button
          key={subreddit.id}
          variant="ghost"
          nativeButton={false}
          render={
            <Link
              to={"/subreddit/$subredditId"}
              params={{ subredditId: subreddit.id }}
              activeProps={{
                className: "bg-muted dark:bg-muted/50",
              }}
            >
              {subreddit.name}
            </Link>
          }
        />
      ))}
    </>
  );
}
