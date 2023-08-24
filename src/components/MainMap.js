import '../style.css';
import ControlPanel from '../components/ControlPanel.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { transform, fromLonLat } from 'ol/proj.js'; 
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { useEffect, useState, useRef } from 'react';

const MainMap = () => {
  const transformCenter = (center) => {
    if (center != null) {
        return transform(center, "EPSG:4326", "EPSG:3857");
    }
  };

  const [latitude, setLatitude] = useState(38);
  const [longitude, setLongitude] = useState(-98);
  const [center] = useState([longitude, latitude]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [feature, setFeature] = useState();
  const [point, setPoint] = useState();
  const [map, setMap] = useState(null);
  const [geolocation, setGeolocation] = useState(null);
  const [view, setView] = useState(null);
  const [transformedCenter] = useState(transformCenter(center));
  const mapRef = useRef();
  mapRef.current = map;
  useEffect(() => {
    // Create a point
    var point = new Point(transformedCenter);
    setPoint(point);
    var feature = new Feature({
      geometry: point,
      name: "Your address is shown here",
    });
    var iconStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#4B0082',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
      }),
    });

    feature.setStyle(iconStyle);
    setFeature(feature); var vectorSource = new VectorSource({
        features: [feature],
    });

    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
        source: vectorSource,
    });
    const view = new View({
      center: transformedCenter,
      zoom: 5,
    });

    setView(view);

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    const locationMap = new Map({
      target: mapRef.current,
      layers: [osmLayer, initalFeaturesLayer,],
      view: view,
    });

    setMap(locationMap);
    setFeaturesLayer(initalFeaturesLayer);

    const geolocation = new Geolocation({ 
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });

    setGeolocation(geolocation);
  }, []);

  // useEffect(() => {
  //   if (!geolocation) return;

  //   const positionFeature = new Feature();
  //   positionFeature.setStyle(
  //     new Style({
  //       image: new CircleStyle({
  //         radius: 6,
  //         fill: new Fill({
  //           color: '#3399CC',
  //         }),
  //         stroke: new Stroke({
  //           color: '#fff',
  //           width: 2,
  //         }),
  //       }),
  //     })
  //   );

  //   const vectorSource = new VectorSource();
  //   const vectorLayer = new VectorLayer({
  //     source: vectorSource,
  //   });
  //   geolocation.setTracking(true);

  //   setGeolocation(geolocation);
  //   map.addLayer(vectorLayer);
  //   vectorSource.addFeature(positionFeature);

  // }, [geolocation, map]);

  const centerOnPoint = (latitude, longitude) => {
    // alert(`${longitude}, ${latitude}`);
    alert("Center");
    view.setCenter(fromLonLat([longitude, latitude]));
    view.setZoom(15);
    map.render();

    console.log(view);
  }
  function zero() {
    map.setView(
        new View({
            center: transformCenter([0,0]),
            zoom: 17,
        })
    );
    console.log(view);
  }
  return (
    <>
      <ControlPanel 
        map={map}
        view={view}
        centerOnPoint={centerOnPoint}
        zero={zero}
        geolocation={geolocation}
        latitude={latitude} 
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
      />
      <div ref={mapRef} className="map"></div>
    </>
  )
};

export default MainMap;