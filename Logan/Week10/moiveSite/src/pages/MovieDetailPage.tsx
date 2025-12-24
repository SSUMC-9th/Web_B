import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  console.log(id);

  return (
    <div>
      영화상세페이지임
      <div>
        <h1>{id}번의 상세페이를 패칭해온다.</h1>
      </div>
    </div>
  );
}
