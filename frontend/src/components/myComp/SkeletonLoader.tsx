import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type SkeletonLoaderProps = {
  count: number;
  className?: ClassNameValue;
};

const SkeletonLoader: FC<SkeletonLoaderProps> = ({ count, className }) => {
  return Array(count)
    .fill(0)
    .map((_, id) => {
      return (
        <Skeleton
          className={cn("w-[145px] h-[210px] rounded-sm", className)}
          key={id}
        />
      );
    });
};

export default SkeletonLoader;
