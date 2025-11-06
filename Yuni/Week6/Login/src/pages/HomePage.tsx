import useGetLpList from "../hooks/queries/useGetLpList.ts";

interface Lp {
  id: number;
  title: string;
}

const HomePage = () => {
  const { data } = useGetLpList({});

  return (
    <div>
      {data?.data.data.map((lp: Lp) => (
        <h1 key={lp.id}>{lp.title}</h1>
      ))}
    </div>
  );
};

export default HomePage;
