import '../style.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj.js'; 
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

const MainMap = () => {
  //38.575764, and the longitude is 
  let [ latitude, setLatitude ] = useState(38.575764);
  let [ longitude, setLongitude ] = useState(-121.478851);
  useEffect(() => {
    const view = new View({
      center: fromLonLat([longitude, latitude]),
      zoom: 2,
    });

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

    const geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });

    function el(id) {
      return document.getElementById(id);
    }
    
    geolocation.setTracking(true);

    const coordinates = geolocation.getPosition();
  }, []);

  return (
    <div id="map"></div>
  );
}

export default MainMap;
