import { useEffect, useState, type JSX } from "react";


export default function Parent():JSX.Element{
    const [visible, setVisible]=useState(false);


    return(
        <>
            <h1>같이 배우는 리액트 #2 useEffect</h1>
            <button onClick={():void=>setVisible(!visible)}>
                {visible ? '숨기기':'보이기'}
            
            </button>
            {visible && <Child/>}
        </>
    )
}



function Child():JSX.Element{
    useEffect(() =>{
        let i=0;
        const countInterval=setInterval((): void=>{
            console.log("Number => "+i);
            i++;
        }, 1000);

        return () =>{
            console.log("언마운트될때 실행됩니다.")
        }
        console.log('Child rendered');
    },[])

    return <div className="mt-20 text-4xl">Child</div>
}