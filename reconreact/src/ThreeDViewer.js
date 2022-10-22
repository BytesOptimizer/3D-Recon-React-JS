import React, { useEffect } from 'react'
import { parse } from '@loaders.gl/core';
import { PLYLoader } from '@loaders.gl/ply';


export const ThreeDViewer = () => {
  useEffect(() => {
    parse(fetch('./merged.ply'), PLYLoader).then((data) => {
      console.log(data)
    }).catch((e) => {
      console.log(e,"error");
    })


  });

  return (
    <div>hello</div>
  )
}
