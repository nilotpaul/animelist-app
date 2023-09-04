import { BarChart3, Filter, Library, Star } from "lucide-react";
import { FC, useEffect } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store";

const Homepage: FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center text-xl space-y-6 mt-12">
        <h1 className="space-x-3 leading-10 text-[2.45rem]">
          <span>Welcome to</span>
          <span>
            <span className="text-red-500">Anime</span>
            <span className="text-muted-foreground">Pulse</span>
          </span>
        </h1>
        <div className="flex items-center justify-center flex-col space-y-2">
          <h2>Your one-stop destination for anime enthusiasts</h2>
          <p className="text-lg text-muted-foreground">
            Track, share and discuss about your favorite anime.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 place-items-center place-content-center mt-14 gap-y-16 gap-x-8 bg-muted/50 rounded-lg px-9 py-12 relative">
        <div className="flex items-center gap-x-4">
          <Library
            size={100}
            className="h-full bg-destructive/80 rounded-full p-1.5"
          />
          <div>
            <span className="text-[1.05rem]">
              Create Your Personal Anime Library
            </span>
            <p className="text-muted-foreground">
              Easily add anime titles to your library. Whether it's a classic
              that you've watched years ago or the latest seasonal release.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Filter
            size={115}
            className="h-full bg-destructive/80 rounded-full p-1.5"
          />
          <div>
            <span className="text-[1.05rem]">Sort and Filter</span>
            <p className="text-muted-foreground">
              Organize your anime collection by various criteria such as genre,
              rating, or release date. Quickly find that hidden gem you've been
              wanting to revisit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Star
            size={110}
            className="h-full bg-destructive/80 rounded-full p-1.5"
          />
          <div>
            <span className="text-[1.05rem]">Set Personal Ratings</span>
            <p className="text-muted-foreground">
              Rate and review each anime you've watched, allowing you to
              remember your thoughts and share your opinions with the community.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <BarChart3
            size={115}
            className="h-full bg-destructive/80 rounded-full p-1.5"
          />
          <div>
            <span className="text-[1.05rem]">Detailed Statistics</span>
            <p className="text-muted-foreground">
              Get insights into your anime-watching habits. See your
              most-watched genres, your average rating, and even how much time
              you've spent on anime.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="default"
          className="rounded-3xl absolute -bottom-6 -translate-x-[50%] left-[50%] p-6 px-9 text-lg"
        >
          <Link to="/user">Join Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
