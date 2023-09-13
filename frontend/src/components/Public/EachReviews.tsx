import { useGetAllReviewQuery } from "@/redux/api/reviewApi";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useGetPublicUsersQuery } from "@/redux/api/publicApi";

const EachReviews: FC = () => {
  const { id } = useParams();
  const { currentData: eachRevs, isFetching: allRevFetch } =
    useGetAllReviewQuery();
  const { currentData: publicUsers, isFetching: pubUserFetch } =
    useGetPublicUsersQuery();

  const revsByAnimeId = eachRevs?.filter((revs) => {
    return revs.animeId === Number(id);
  });

  const animeName = revsByAnimeId?.find((name) => {
    return name.title;
  });

  const reviewer = (userId: string) => {
    const findUser = publicUsers?.find((user) => {
      return user._id === userId;
    });

    return findUser;
  };

  const date = (rev: string) => {
    return new Date(rev.slice(0, 10).toString());
  };

  if (allRevFetch || pubUserFetch) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div>
      {revsByAnimeId?.length !== 0 ? (
        <>
          <h2 className="leading-8">Reviews of {animeName?.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-content-center gap-x-3">
            {revsByAnimeId?.map((rev) => {
              return (
                <Card key={rev._id} className="mt-4 grid">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl leading-6">
                      {rev.reviewTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">{rev.review}</CardContent>
                  <CardFooter className="font-normal text-[0.9rem] leading-[0.9rem] text-muted-foreground space-x-1">
                    <span>by</span>
                    <span className="hover:underline">
                      <Link
                        to={`/user/${reviewer(rev.user)
                          ?.name.split(" ")[0]
                          .toLowerCase()}`}
                      >
                        {reviewer(rev.user)?.name.split(" ")[0].toLowerCase() ||
                          "deleteduser"}
                      </Link>
                    </span>
                    <span>on</span>
                    <span> {date(rev.createdAt).toDateString()}</span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <h3>No reviews yet!</h3>
      )}
    </div>
  );
};

export default EachReviews;
