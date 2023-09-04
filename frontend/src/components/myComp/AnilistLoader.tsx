import { FC } from "react";
import { Skeleton } from "../ui/skeleton";

const AnilistLoader: FC = () => {
  return (
    <div className="relative">
      <Skeleton className="w-[145px] h-[210px] rounded-sm" />
      <Skeleton className="absolute bottom-0 w-full h-16 bg-muted rounded-none rounded-b-sm" />
      <div className="flex items-center justify-center">
        <Skeleton className="h-3 w-[85%] absolute bottom-10 animate-bounce" />
        <div className="absolute flex items-center justify-between w-[85%] bottom-2 rounded-sm">
          <Skeleton className="h-3 w-8 animate-bounce" />
          <Skeleton className="h-3 w-8 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default AnilistLoader;
