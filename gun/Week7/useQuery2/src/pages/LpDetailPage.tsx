import { useParams } from "react-router-dom";

const LpDetailPage = () => {
    const {lpid} = useParams();

  return (
    <div className={"mt-12"}> LP 상세 페이지 {lpid} </div>
  )
}

export default LpDetailPage
