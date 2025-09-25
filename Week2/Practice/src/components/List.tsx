export type Tech = 
    |'REACT' 
    | 'NEXT' 
    | 'VUE' 
    | 'SVELTE' 
    | 'ANGULAR' 
    | 'REACT-NATIVE';   

//유니온 타입, 위 문자열 중 하나만 들어올 수 있음.
//특정문자열만 허용하는 좁은 타입 -> String과 Tech는 다름

interface ListProps {
    tech : Tech;
}

const List = ({ tech }:ListProps)=> {
  return (
    <li style={{ listStyle: 'none' }}>
        {tech === 'REACT' ? '고구마와 함께하는 리액트' : tech}
    </li>
  )
};

export default List