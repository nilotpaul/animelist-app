export type Anilist = {
  user: string;
  _id: string;
  animeId: number;
  title: string;
  image: string;
  genres: Genre[];
  studios: Studio[];
  status:
    | "completed"
    | "watching"
    | "rewatching"
    | "planning"
    | "dropped"
    | "paused";
  episodes: number;
  score: number;
  comment?: string;
  lastAdded: number;
  createdAt: string;
  updatedAt: string;
};

export type EditAnilist = Partial<
  Pick<Anilist, "status" | "score" | "comment" | "episodes">
> & {
  _id: string;
};

export type AddAnimeRes = Status &
  Omit<Anilist, "user" | "_id" | "updatedAt" | "createdAt">;

export type AnimeById = { data: AnimeData };

export type FavoritesInAnilist = Pick<
  Anilist,
  "_id" | "user" | "animeId" | "title" | "image"
>;

export type Review = Pick<
  Anilist,
  "_id" | "user" | "animeId" | "title" | "image" | "createdAt" | "updatedAt"
> & {
  reviewTitle: string;
  review: string;
};

// JikanApi response
type Pagination = {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
};

type Image = {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
};

type Trailer = {
  youtube_id: string;
  url: string;
  embed_url: string;
  images: Image;
};

type Title = {
  type: string;
  title: string;
};

type Aired = {
  from: string;
  to: string;
  prop: {
    from: {
      day: number;
      month: number;
      year: number;
    };
    to: {
      day: number;
      month: number;
      year: number;
    };
  };
  string: string;
};

type Producer = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Licensor = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Studio = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Genre = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Theme = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Demographic = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type AnimeData = {
  mal_id: number;
  url: string;
  images: {
    jpg: Image;
    webp: Image;
  };
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: null | string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: Producer[];
  licensors: Licensor[];
  studios: Studio[];
  genres: Genre[];
  //   explicit_genres: any[];
  themes: Theme[];
  demographics: Demographic[];
};

type AnimeResponse = {
  pagination: Pagination;
  data: AnimeData[];
};

// JikanApi filters
export type Filters = {
  page: string;
  name: string;
  type: string;
  order: string;
};

// JikanApi ById fullData
export type AnimeResponseFull = {
  data: {
    theme: theme;
  } & AnimeData;
};

export type theme = {
  openings: string[];
  endings: string[];
};

// JikanApi Characters ById
type ImageType = {
  image_url: string;
  small_image_url?: string;
};

type PersonType = {
  mal_id: number;
  url: string;
  images: {
    jpg: ImageType;
  };
  name: string;
};

type VoiceActorType = {
  person: PersonType;
  language: string;
};

type CharacterType = {
  mal_id: number;
  url: string;
  images: {
    jpg: ImageType;
    webp?: ImageType;
  };
  name: string;
};

type DataItemType = {
  character: CharacterType;
  role: string;
  favorites: number;
  voice_actors: VoiceActorType[];
};

type AnimeCharacters = {
  data: DataItemType[];
};
