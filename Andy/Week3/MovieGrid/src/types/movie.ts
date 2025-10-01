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
  "adult": boolean,
  "backdrop_path": string,
  "belongs_to_collection": null | object,
  "budget": number,
  "genres": { id: number, name: string }[],
  "homepage": string,
  "imdb_id": string,
  "original_language": string,
  "original_title": string,
  "overview": string,
}