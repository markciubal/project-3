import React, { Component, useEffect, useState, useRef, useCallback  } from "react";
import { render } from "react-dom";
import '../App.css';
import ControlPanel from "./ControlPanel";
import BottomMenu from "./BottomMenu";
import Post from './Post';
import SlidingPane from "react-sliding-pane";
import { Menu } from "@szhsin/react-menu";
import { fromLonLat } from "ol/proj";
import { toLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry, Point } from "ol/geom";
import { Geolocation as OLGeoLoc } from "ol";
import { createEmpty, extend, getHeight, getWidth } from "ol/extent";
import { useGeolocated } from "react-geolocated";
import Login from './Login';

import "ol/ol.css";

import {
  RMap,
  ROSM,
  RLayerVector,
  RLayerCluster,
  RFeature,
  RGeolocation,
  ROverlay,
  RStyle,
  useOL,
} from "rlayers";

import { RCircle, RFill, RText,   RStroke, RRegularShape } from "rlayers/style";
import CenterMenu from "./CenterMenu";
import "react-sliding-pane/dist/react-sliding-pane.css";

const reader = new GeoJSON({ featureProjection: "EPSG:3857" });
const colorBlob = (size) =>
  "rgba(" +
  [255, 255, 255, Math.min(0.8, 0.4 + Math.log(size / 10) / 20)].join() +
  ")";
const radiusStar = (feature) => Math.round(5 * (parseFloat(feature.get("mag")) - 2.5));


// This returns the north/south east/west extent of a group of features
// divided by the resolution
const extentFeatures = (features, resolution) => {
  const extent = createEmpty();
  for (const f of features) extend(extent, f.getGeometry().getExtent());
  return Math.round(0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
};
const MainMap = () => {

  // Map states.
  // Paired in [ LONGITUDE, LATITUDE ] because OpenLayers uses the pair (Longitude before Latitude, i.e., toLonLat, fromLonLat).
  const GEOGRAPHIC_CENTER_OF_UNITED_STATES = [-103.771556, 44.967243];
  const [coordinateRoundTo, setCoordinateRoundTo] = useState(3);
  const [view, setView] = useState({ center: fromLonLat(GEOGRAPHIC_CENTER_OF_UNITED_STATES), zoom: 3, extent: [-20037508.34, 20037508.34, 20037508.34, -20037508.34] });
  const [centerLatitude, setCenterLatitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[0]);
  const [centerLongitude, setCenterLongitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[1]);
  const [currentEmoji, setCurrentEmoji] = useState('▼');
  
  // Bottom sliding pane state.
  const [isPostPaneOpen, setIsPostPaneOpen] = useState(false);
  const [isLoginPaneOpen, setIsLoginPaneOpen] = useState(false);
  
  const geoJSONString = JSON.stringify(
    {
    "type": "FeatureCollection",
    "metadata": {
      "generated": 1693082887000,
      "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
      "title": "USGS Magnitude 2.5+ Earthquakes, Past Day",
      "status": 200,
      "api": "1.10.3",
      "count": 25
    },
    "features": [
      {
        "type": "Feature",
        "properties": {
          "mag": 4,
          "place": "87 km S of Nikolski, Alaska",
          "time": 1693079204894,
          "updated": 1693080299554,
          "tz": null,
          "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us7000kr82",
          "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000kr82.geojson",
          "felt": null,
          "cdi": null,
          "mmi": 1.332,
          "alert": null,
          "status": "reviewed",
          "tsunami": 0,
          "sig": 246,
          "net": "us",
          "code": "7000kr82",
          "ids": ",ak023axxhsxn,us7000kr82,",
          "sources": ",ak,us,",
          "types": ",origin,phase-data,shakemap,",
          "nst": 27,
          "dmin": 0.817,
          "rms": 0.71,
          "gap": 214,
          "magType": "mb",
          "type": "earthquake",
          "title": "M 4.0 - 87 km S of Nikolski, Alaska"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -168.6862,
            52.1631,
            35
          ]
        },
        "id": "us7000kr82"
      }
    ]
  }
  );
  const [data, setData] = useState(geoJSONString);

  //For clustering posts.
  const [distance, setDistance] = useState(20);
  const [selected, setSelected] = useState("Click a cluster for details");

  // For managing the user's current position.
  const [currentLatitude, setCurrentLatitude] = useState();
  const [currentLongitude, setCurrentLongitude] = useState();
  const [accuracy, setAccuracy] = useState();

  const earthquakeLayer = useRef();

  const panToMe = async () => {
    const successCallback = async (position) => {
      console.log(position.coords);
      setCurrentLongitude(position.coords.longitude);
      setCurrentLatitude(position.coords.latitude);
      setView({ center: fromLonLat([position.coords.longitude, position.coords.latitude]), zoom: view.zoom });
      console.log(view);
    };
    
    const errorCallback = async (error) => {
      console.log(error);
    };
    
    const id = await navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  useEffect(() => {
    let viewCenter = toLonLat(view.center);
    setCenterLatitude(viewCenter[1]);
    setCenterLongitude(viewCenter[0]);
  }, [view]);

  useEffect(() => {
    async function fetchData() {
      // fetch the data from the url, this will need to be updated to fetch posts from database.
      const geojson = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
      // parse the data
      const parsedData = await JSON.stringify(geojson.json());
      // use the data
      setData(parsedData);
      console.log(data); 
    }
    fetchData();
  }, []);

  return (
    <>
      {/* // Bottom sliding pane state.
  const [isPostPaneOpen, setIsPostPaneOpen] = useState(false);
  const [isLoginPaneOpen, setIsLoginPaneOpen] = useState(false); */}
      <ControlPanel 
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        isPostPaneOpen={isPostPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
        isLoginPaneOpen={isLoginPaneOpen}
        setIsLoginPaneOpen={setIsLoginPaneOpen}
      />
      <RMap
        className="map"
        initial={view}
        view={[view, setView]}
        noDefaultControls={true}
      >
        <ROSM />
        <RLayerVector>
          <RFeature geometry={new Point(fromLonLat([centerLongitude, centerLatitude]))} >
            <RStyle.RStyle>
              
              <RStyle.RCircle radius={7}>
                {/* <RStyle.RFill color="#F8F7F4" /> */}
                <RStyle.RStroke width="2" color="darkred" />
              </RStyle.RCircle>
            </RStyle.RStyle>
          </RFeature>
          <RLayerCluster
            ref={earthquakeLayer}
            distance={distance}
            format={new GeoJSON({ featureProjection: "EPSG:3857" })}
            url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
            onClick={React.useCallback((e) => {
              const features = e.target.get("features") ?? [];
              setSelected(
                `${features.length} earthquakes in this location, ` +
                  `magnitudes are ${features
                    .map((eq) => eq.get("mag"))
                    .join(", ")}`
              );
            }, [])}
          >
          <RStyle.RStyle
            cacheSize={1024}
            cacheId={useCallback(
              (feature, resolution) =>
                // This is the hashing function, it takes a feature as its input
                // and returns a string
                // It must be dependant of the same inputs as the rendering function
                feature.get("features").length > 1
                  ? "#" + extentFeatures(feature.get("features"), resolution)
                  : "$" + radiusStar(feature.get("features")[0]),
              []
            )}
            render={useCallback((feature, resolution) => {
              // This is the rendering function
              // It has access to the cluster which appears as a single feature
              // and has a property with an array of all the features that make it
              const size = feature.get("features").length;
              // This is the size (number of features) of the cluster
              if (size > 1) {
                // Render a blob with a number
                const radius = extentFeatures(
                  feature.get("features"),
                  resolution
                );
                return (
                  // A dynamic style should return a fragment instead of a
                  // full-blown RStyle - returning a full RStyle here
                  // will simply replace the style used by the vector layer
                  // with a fixed one
                  <React.Fragment>
                    <RCircle radius={radius}>
                      <RFill color={colorBlob(size)} />
                      <RStroke color="rgba(0, 0, 0, 0.6)" width={1} />
                    </RCircle>
                    <RText text={size.toString()}>
                      <RFill color="#fff" />
                      <RStroke color="rgba(0, 0, 0, 0.6)" width={5} />
                    </RText>
                  </React.Fragment>
                );
              }
              // We have a single feature cluster
              const unclusteredFeature = feature.get("features")[0];
              // Render a star
              return (
                <RRegularShape
                  radius1={radiusStar(unclusteredFeature)}
                  radius2={5}
                  points={8}
                  angle={Math.PI}
                >
                  <RFill color="rgba(255, 255, 255, 0.8)" />
                  <RStroke color="rgba(0, 0, 0, 0.2)" width={1} />
                </RRegularShape>
              );
            }, [])}
          />
        </RLayerCluster>
        </RLayerVector>
      </RMap>
      {/* <BottomMenu
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        setIsPaneOpen={setIsPaneOpen}
        currentEmoji={currentEmoji}
        panToMe={panToMe}
      /> */}
      <CenterMenu
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        isPostPaneOpen={isPostPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
        isLoginPaneOpen={isLoginPaneOpen}
        setIsLoginPaneOpen={setIsLoginPaneOpen}
        currentEmoji={currentEmoji}
        panToMe={panToMe}
      />    
      <SlidingPane
        closeIcon={<div>Close</div>}
        className="bottom-pane"
        from="bottom"
        isOpen={isPostPaneOpen}
        onRequestClose={() => {
          setIsPostPaneOpen(false);
        }}  
        width="100%"
      >
        {selected}
        <Post />
      </SlidingPane>
      <SlidingPane
        closeIcon={<div>Close</div>}
        className="bottom-pane"
        from="bottom"
        isOpen={isLoginPaneOpen}
        onRequestClose={() => {
          setIsLoginPaneOpen(false);
        }}  
        width="100%"
      >
        {selected}
        <Login />
      </SlidingPane>
    </>
  )
};

export default MainMap;