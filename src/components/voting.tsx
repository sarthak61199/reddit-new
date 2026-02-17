import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import type { VoteType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface VotingProps {
  onVote: (type: VoteType) => void;
  voteCount: number;
  userVote: VoteType | null;
}

function Voting({ onVote, voteCount, userVote }: VotingProps) {
  const handleVote = (type: VoteType) => {
    onVote(type);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="size-8 group cursor-pointer"
        onClick={() => handleVote("UP")}
      >
        <ArrowUp
          className={cn(
            "size-5 group-hover:text-orange-500 transition-all",
            userVote === "UP" && "text-orange-500",
          )}
        />
      </Button>
      <span className="text-sm font-semibold">{voteCount}</span>
      <Button
        variant="ghost"
        size="sm"
        className="size-8 group cursor-pointer"
        onClick={() => handleVote("DOWN")}
      >
        <ArrowDown
          className={cn(
            "size-5 group-hover:text-purple-500 transition-all",
            userVote === "DOWN" && "text-purple-500",
          )}
        />
      </Button>
    </div>
  );
}

export default Voting;
