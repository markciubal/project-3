import '../style.css';
import ControlPanel from '../components/ControlPanel.js';
import Map from 'ol/Map.js';
import View  from 'ol/View.js';
import { useGeographic, transform, fromLonLat } from 'ol/proj.js'; 
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { useEffect, useState, useRef } from 'react';

const MainMap = () => {
  const [latitude, setLatitude] = useState(38);
  const [longitude, setLongitude] = useState(-98);
  const [center, setCenter] = useState([longitude, latitude]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [feature, setFeature] = useState();
  const [point, setPoint] = useState();
  const [map, setMap] = useState();
  const [geolocation, setGeolocation] = useState(null);
  const [selectedCoord, setSelectedCoord ] = useState([longitude, latitude]);

  const mapRef = useRef();
  mapRef.current = map;

  useEffect(() => {
    // Create a point
    var point = new Point(transform(selectedCoord, "EPSG:4326", "EPSG:3857"));
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
      })
    });
    feature.setStyle(iconStyle);
    setFeature(feature);
    var vectorSource = new VectorSource({
        features: [feature],
    });

    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
        source: vectorSource,
    });
    const initialView = new View({
      center: transform(selectedCoord, "EPSG:4326", "EPSG:3857"),
      zoom: 5,
    });
    const locationMap = new Map({
      target: mapRef.current,
      layers: [
          new TileLayer({
              source: new OSM(),
          }),
          initalFeaturesLayer,
      ],
      view: initialView,
      controls: [],
  });
  setMap(locationMap);
  // mapRef.current = locationMap;
  setFeaturesLayer(initalFeaturesLayer);
  console.log('useEffect');
  }, [selectedCoord]);

  const centerOnPoint = (latitude, longitude) => {
    alert("Center");
  }
  const zero = async () => {
    if (mapRef.current) {
      setSelectedCoord([0, 0]);
      console.log(selectedCoord);

      // const zeroView = new View({
      //   center: transformCenter(selectedCoord),
      //   zoom: 5,
      // });
      // console.log(zeroView);
      // mapRef.current.setView(zeroView);
    }
 }
 console.log('drawing');
  return (
    <>
      <ControlPanel 
        map={map}
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


  //   const geolocation = new Geolocation({ 
  //     trackingOptions: {
  //       enableHighAccuracy: true,
  //     },
  //     projection: view.getProjection(),
  //   });

  //   setGeolocation(geolocation);
  //   function el(id) {
  //     return document.getElementById(id);
  //   }
    
  // geolocation.setTracking(true);
  // console.log(geolocation);
  
  // const positionFeature = new Feature();

  // positionFeature.setStyle(
  //   new Style({
  //     image: new CircleStyle({
  //       radius: 6,
  //       fill: new Fill({
  //         color: '#3399CC',
  //       }),
  //       stroke: new Stroke({
  //         color: '#fff',
  //         width: 2,
  //       }),
  //     }),
  //   })
  // );
  //   geolocation.on('change:position', function () {
  //     const coordinates = geolocation.getPosition();
  //     positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  //   });

  
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
