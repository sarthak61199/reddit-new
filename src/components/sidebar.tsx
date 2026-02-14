import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateSubreddit from "@/components/create-subreddit";

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
      </div>
    </aside>
  );
}
