export type Movie = {
  "adult": boolean,
  "backdrop_path": string,
  "genre_ids": number[],
  "id": number,
  "original_language": string,
  "original_title": string,
  "overview": string,
  "popularity": number,
  "poster_path": string,
  "release_date": string,
  "title": string,
  "video": boolean,
  "vote_average": number,
  "vote_count": number;
};

export type MoviesResponse = {
  "page": number,
  total_pages: number,
  total_results: number,
  results: Movie[];
}

export type MovieResponse = {
  "id": number,
  "title": string,
  "backdrop_path": string,
  "poster_path": string,
  "genres": { id: number, name: string }[],
  "homepage": string,
  "imdb_id": string,
  "original_language": string,
  "overview": string,
  "vote_average": number,
  "vote_count": number,
  "release_date": string,
  "runtime": number,
}

export type Cast = {
  "id": number,
  "name": string,
  "character": string,
  "profile_path": string | null,
}

export type Crew = {
  "id": number,
  "name": string,
  "job": string,
  "profile_path": string | null,
}

export type CreditsResponse = {
  "id": number,
  "cast": Cast[],
  "crew": Crew[],
}