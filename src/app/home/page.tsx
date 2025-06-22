"use client";

import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [data, setData] = useState("");

  const handleClick = async() => {
    const res = await axios.get("/api/run")
    console.log(res.data)
    setData(res.data.message)
  };

  

  return (
    <div>
      <h1 className='text-6xl '>  hello </h1>
      <p>{data}</p>
      <button className='bg-amber-500 ' onClick={handleClick}>Set Data</button>
      <br/>
     
    </div>
  );
};

export default Page;
