import { useGetAllReviewQuery } from "../../redux/api/reviewApi";
import { useAppSelector } from "@/redux/store";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type ReviewProps = {
  className?: ClassNameValue;
};

const Review: FC<ReviewProps> = ({ className }) => {
  const { user } = useAppSelector((state) => state.userSlice);
  const { currentData: revs, isFetching } = useGetAllReviewQuery();
  const userName = user?.name.split(" ")[0];

  const userSpecificRevs = revs?.filter((rev) => {
    return rev.user === user?.id;
  });

  if (isFetching) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div>
      <h3 className={cn("capitalize text-xl underline ml-2", className)}>
        All Reviews By {userName}
      </h3>
      {userSpecificRevs?.length !== 0 ? (
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-y-4 break-words mt-2"
        >
          {userSpecificRevs?.map((items, id) => {
            return (
              <AccordionItem key={items._id} value={`item-${id + 1}`}>
                <AccordionTrigger>
                  <div className="flex items-center justify-center gap-x-3">
                    <span className="text-lg">{items.reviewTitle}</span>
                    <span className="text-base">({items.title})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>{items.review}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <p className="mt-2">No reviews yet!</p>
      )}
    </div>
  );
};

export default Review;
