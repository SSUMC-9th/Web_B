import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});
//console.log("TMDB TOKEN:", import.meta.env.VITE_TMDB_TOKEN);

export default axiosClient;
