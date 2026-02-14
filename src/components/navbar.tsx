import { Plus } from "lucide-react";
import { AccountDropdown } from "@/components/account-dropdown";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePost from "@/components/create-post";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger
              render={
                <Button className="cursor-pointer">
                  <Plus className="size-4 mr-2" /> Create Post
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>
              <CreatePost />
            </DialogContent>
          </Dialog>
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}
