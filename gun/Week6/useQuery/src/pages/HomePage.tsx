
import useGetLpList from "../hooks/queries/useGetLPList";

const HomePage = () => {
  const {data, isPending, isError} = useGetLpList({});

  console.log(data?.data.data?.map((lp) => lp.id))

  return <div></div>;
}
export default HomePage;