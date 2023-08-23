import logo from './logo.svg';
import './App.css';
import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useEffect } from 'react';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

function App() {
  return (
    <div className="App">
      <div id="map" className={"map"}></div>
    </div>
  );
}

export default App;
