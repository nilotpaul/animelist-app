import { Route, Routes } from "react-router-dom";

import Homepage from "./components/Public/Homepage";
import User from "./components/myComp/User";
import Dashboard from "./components/myComp/Dashboard";
import AnimeList from "./components/myComp/AnimeList";
import Navbar from "@/components/Public/Navbar";
import AllAnime from "./components/Public/AllAnime";
import Review from "./components/myComp/Review";
import EachAnime from "./components/Public/EachAnime";
import AllFavourites from "./components/myComp/AllFavourites";
import MangaList from "./components/myComp/MangaList";
import EachReviews from "./components/Public/EachReviews";
import { useAppSelector } from "./redux/store";
import EachAnimeList from "./components/Public/EachAnimeList";

function App() {
  const { user } = useAppSelector((state) => state.userSlice);
  const userName = user?.name.split(" ")[0].toLowerCase();

  return (
    <>
      <Navbar />
      <main className="mt-6 w-auto text-base max-w-[1280px] mx-auto px-10 mb-6">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/user" element={<User />} />
          <Route path={`/dashboard`} element={<Dashboard />} />
          <Route path={`/${userName}/animelist`} element={<AnimeList />} />
          <Route path={`/anime`} element={<AllAnime />} />
          <Route path={`/${userName}/reviews`} element={<Review />} />
          <Route path={`/anime/:id`} element={<EachAnime />} />
          <Route path={`/${userName}/favorites`} element={<AllFavourites />} />
          <Route path={`/${userName}/mangalist`} element={<MangaList />} />
          <Route path={`/anime/:id/reviews`} element={<EachReviews />} />
          <Route path={`/user/:user`} element={<EachAnimeList />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
