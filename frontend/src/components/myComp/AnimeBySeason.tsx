import { useGetAnimeBySeasonQuery } from "@/redux/api/animeApi";
import { FC, useState } from "react";
import { Button } from "../ui/button";

const AnimeBySeason: FC = () => {
  const [onPage, setOnPage] = useState(1);

  const { currentData: seasonalAnime } = useGetAnimeBySeasonQuery(
    onPage.toString() || "1"
  );

  return (
    <div className="mt-4">
      <div className=" bg-[#0f0f11] py-8 rounded-md">
        <h2 className="font-bold text-center">Top Anime (Goats)</h2>
        {
          <div className="grid grid-cols-card place-items-center place-content-center gap-y-8 mt-6">
            {seasonalAnime?.data
              ?.map((items) => {
                return (
                  <div
                    key={items.title_japanese}
                    className="relative w-[155px] cursor-pointer h-[220px]"
                  >
                    <p>{items.title}</p>
                  </div>
                );
              })
              .slice(0, 18)}
          </div>
        }

        <div className="text-center mt-16 space-x-4">
          {onPage > 1 ? (
            <Button
              onClick={() => {
                onPage > 1 ? setOnPage(onPage - 1) : undefined;
                window.localStorage.setItem(
                  "seasonPage",
                  JSON.stringify(onPage - 1)
                );
              }}
            >
              Previous
            </Button>
          ) : (
            <Button disabled>Previous</Button>
          )}
          <span>Page: {onPage}</span>
          <Button
            onClick={() => {
              onPage <= seasonalAnime!.pagination.last_visible_page
                ? setOnPage(onPage + 1)
                : undefined;
              window.localStorage.setItem(
                "seasonPage",
                JSON.stringify(onPage + 1)
              );
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimeBySeason;
