'use client'

import React from 'react'
import { useSelector } from 'react-redux';

const Counter = () => {
      const count  = useSelector((state:any)=>state.counter.value);

  console.log("count",count)
  return (
    <div>Counter</div>
  )
}

export default Counter