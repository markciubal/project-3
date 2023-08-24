import '../style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj.js'; 

const MainMap = () => {
  //38.575764, and the longitude is 
  let [ latitude, setLatitude ] = useState(38.575764);
  let [ longitude, setLongitude ] = useState(-121.478851);
  useEffect(() => {
   
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 10,
      }),
    });
  }, []);

  return (
    <div id="map"></div>
  );
}

export default MainMap;
