export type Cast = {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  original_name: string;
};

export type CreditResponse = {
  id: number;
  cast: Cast[];
};

// {
//   "id": 550,
//   "cast": [
//     {
//       "adult": false,
//       "gender": 2,
//       "id": 819,
//       "known_for_department": "Acting",
//       "name": "Edward Norton",
//       "original_name": "Edward Norton",
//       "popularity": 26.99,
//       "profile_path": "/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg",
//       "cast_id": 4,
//       "character": "The Narrator",
//       "credit_id": "52fe4250c3a36847f80149f3",
//       "order": 0
//     },
