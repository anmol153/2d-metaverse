import React, { useCallback } from 'react'

const DIVofPlayer = (({x,y}) => {
  return <>
        {console.log("i ams here")}
        <div className ={`absolute left-${x} top-${y}`}>Hello</div>
    </>
})

export default DIVofPlayer;