import React, { useEffect, useState, type JSX } from 'react'

export default function UseEffectPage() :Element{

    const [count, setCount]=useState(0);

    const handleIncrease= ():JSX.Element=>{
        setCount((prev):number=>prev+1)
        console.log('setState(useState를 이용한)의 카운트:',count)
    };


    // 렌더링될때마다 매번ㅅ ㅣㄹ행됨
    useEffect(() => {
        // 실행하고 싶은코드
        console.log(count);

        // optional return function

        return () =>{
            console.log('청소하는 함수입니다.')
        }
        // 의존성배열_ useeffect를 매번실행시키는게 아니라, count값이 변화될때만 

    }, [count] )
    return (
        <div>
            <h3>useEffectPage</h3>
            <h1>{count}</h1>
            <button onClick={handleIncrease}>증가</button>
        
        </div>
  )
}

// 화면이 처음 마운트 됐을때 iuseSTate로 초기값을 얻어오고 useEffect가 리액트에 있따고 반환
// 화면이 업데이트 한 값을 출력한다.
