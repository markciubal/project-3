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
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const [latitude, setLatitude] = useState(38);
  const [longitude, setLongitude] = useState(-98);
  const [selectedCoord, setSelectedCoord ] = useState([longitude, latitude]);

  const [mapView, setMapView] = useState();
  const [center, setCenter] = useState([longitude, latitude]);
  const [feature, setFeature] = useState();
  const [point, setPoint] = useState();
  const [geolocation, setGeolocation] = useState(null);
  // pull refs
  const mapElement = useRef();
  
  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef();
  mapRef.current = map;

  useEffect(() => {
    // Create a point
    var point = new Point(selectedCoord);
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
    const initialFeaturesLayer = new VectorLayer({
        source: vectorSource,
    });
    const initialView = new View({
      projection: 'EPSG:3857',
      center: selectedCoord,
      zoom: 5,
    });

    setMapView(initialView); 

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
          new TileLayer({
              source: new OSM(),
          }),
          initialFeaturesLayer,
      ],
      view: initialView,
      controls: [],
  });
  initialMap.on('click', handleMapClick)

  setMap(initialMap);
  // mapRef.current = initialMap;
  setFeaturesLayer(initialFeaturesLayer);
  console.log('useEffect');
  }, []);
  useEffect(() => {
    if (mapRef.current) {
      const zeroView = new View({
        projection: 'EPSG:3857',
        center: selectedCoord,
        zoom: 5,
      });
      mapRef.current.setView(zeroView);
    }
    
  }, [selectedCoord]);
  const centerOnPoint = (latitude, longitude) => {
    alert("Center");
  }
  const zero = async () => {
    setSelectedCoord([10, 0]);
    console.log(selectedCoord);
 }
 const handleMapClick = (event) => {

    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');

    // set React state
    setSelectedCoord( transormedCoord )

    console.log(transormedCoord)
    
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
      <div ref={mapElement} className="map"></div>
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
