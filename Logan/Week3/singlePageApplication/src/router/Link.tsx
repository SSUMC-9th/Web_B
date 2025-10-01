import { getCurrentPath, navigateTo } from '../utils';
import type {LinkProps} from './types'
import type { MouseEvent } from "react";

const Link=({to, childeren}: LinkProps)=>{
    const handleClick=(e: MouseEvent<HTMLAnchorElement>)=>{
        e.preventDefault();
        if(getCurrentPath()==to)return;
        navigateTo(to);
    }
    return (
        <a href={to} onClick={handleClick}>
            {childeren}
        </a>
    )

}