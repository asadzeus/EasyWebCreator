module.exports = () =>`
"use client"
import dynamic from 'next/dynamic';

const MapSection = dynamic(() => import('./MapSection'), {
  ssr: false
});

const Map = ({position, zoom, style}) => {

  return (
    <div>
      <MapSection position={position} zoom={zoom} style={style}/>
    </div>
  )
}

export default Map;
`;
