import React, { useEffect, useState } from 'react'
import { parse } from '@loaders.gl/core';
import { PLYLoader } from '@loaders.gl/ply';
import { PointCloudLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { COORDINATE_SYSTEM, OrbitView, LinearInterpolator } from '@deck.gl/core';

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  rotationX: 0,
  rotationOrbit: 0,
  minZoom: 0,
  maxZoom: 10,
  zoom: 1
};
const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);
export const ThreeDViewer = ({ onLoad }) => {
  const [viewState, updateViewState] = useState(INITIAL_VIEW_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [plyData, setPlyData] = useState();
  useEffect(() => {
    parse(fetch('./merged.ply'), PLYLoader).then((data) => {
      console.log(data)
      setPlyData(data);
    }).catch((e) => {
      console.log(e, "error");
    })
    if (!isLoaded) {
      return;
    }
    const rotateCamera = () => {
      updateViewState(v => ({
        ...v,
        rotationOrbit: v.rotationOrbit + 120,
        transitionDuration: 2400,
        transitionInterpolator,
        onTransitionEnd: rotateCamera
      }));
    };
    rotateCamera();
  }, [isLoaded]);

  const onDataLoad = ({ header }) => {
    if (header.boundingBox) {
      const [mins, maxs] = header.boundingBox;
      // File contains bounding box info
      updateViewState({
        ...INITIAL_VIEW_STATE,
        target: [(mins[0] + maxs[0]) / 2, (mins[1] + maxs[1]) / 2, (mins[2] + maxs[2]) / 2],
        /* global window */
        zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0])) - 1
      });
      setIsLoaded(true);
    }

    if (onLoad) {
      onLoad({ count: header.vertexCount, progress: 1 });
    }
  };

  const layers = [
    new PointCloudLayer({
      id: 'laz-point-cloud-layer',
      data: plyData,
      onDataLoad,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      getNormal: d => d.normal,
      getColor: (d)=>{
        console.log(d,"color");
        return d.color;
      },
      // getNormal: [0, 1, 0],
      // getColor: [255, 0, 0],
      opacity: 0.5,
      pointSize: 0.5,
      // Additional format support can be added here
      loaders: [PLYLoader]
    })
  ];
  // const layers = new PointCloudLayer({
  //   id: 'point-cloud-layer',
  //   plyData,
  //   pickable: false,
  //   coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
  //   coordinateOrigin: [-122.4, 37.74],
  //   radiusPixels: 4,
  //   getPosition: d => d.position,
  //   getNormal: d => d.normal,
  //   getColor: d => d.color,
  //   loaders: [PLYLoader]
  // });



  return (
    <DeckGL
      views={new OrbitView({ orbitAxis: 'Y', fov: 50 })}
      viewState={viewState}
      controller={true}
      onViewStateChange={v => updateViewState(v.viewState)}
      layers={layers}
      // parameters={{
      //   clearColor: [0.93, 0.86, 0.81, 1]
      // }}
    />
  )
}
