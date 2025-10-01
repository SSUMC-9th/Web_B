import React from 'react'
import { useParams } from 'react-router-dom';

const MovieDetailPage=() => {
    const params =useParams();

    console.log(params);

  return (
    <div>
      무비디테일페이지임{params.movieId}
    </div>
  )
};
export default MovieDetailPage;
