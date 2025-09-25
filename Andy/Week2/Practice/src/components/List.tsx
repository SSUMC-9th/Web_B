export type Chara = '춘식이' | '라이언' | '어피치' | '프로도';

interface ListProps {
  name: Chara;
}

const List = ({ name }: ListProps) => {
  return (
    <>
      <li style={{ listStyle: 'none' }}>
        {name}
      </li>
    </>
  );
}

export default List;