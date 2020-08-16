import React from 'react'
import './Loader.css'

const Loader = () =>
    <div className='loader'>
      <svg viewBox='0 0 120 120'>
        <g className='g1'>
            <rect className='r1' x='30' y='30' width='60' height='60'/>
            <rect className='big' x='81' y='81' width='8' height='8'/>
            <rect className='r_ol' x='31' y='31' width='8' height='8'/>
            <rect className='r_or' x='81' y='31' width='8' height='8'/>
            {getXrect()}

        </g>
    </svg>
</div>

const getXrect = () => {
    // @ts-ignore
    return (<xrect className='r_ur' x='81' y='81' width='8' height='8'/>)
}

export default Loader
