import { useNavigate } from 'react-router-dom';
import {type LP} from '../../type/lp.ts'

interface LpCardProps {
    lp: LP;
}

export const LpCard = ({lp}: LpCardProps) => {
    const navigate = useNavigate();
    return (
    <div 
    onClick={()=>navigate(`lps/${lp.id}`)}
    key={lp.id} 
    className='relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer'
    >
        <img
            src={lp.thumbnail}
            alt={lp.title}
            className='object-cover w-ful h-48'/>
        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2'>
        <h3 className='text-white text-sm font-semibold'>{lp.title}</h3>
        </div>
    </div>
    )
}
