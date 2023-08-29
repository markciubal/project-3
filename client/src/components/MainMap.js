import React, { Component, useEffect, useState, useRef, useCallback  } from "react";
import '../App.css';
import ControlPanel from "./ControlPanel";
import Post from './Post';
import SelectedPosts from "./SelectedPosts";
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
  RControl,
  RGeolocation,
  ROverlay,
  RStyle,
  useOL,
} from "rlayers";

import { RCircle, RFill, RText, RStroke, RRegularShape } from "rlayers/style";
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
  const [isSelectedPaneOpen, setIsSelectedPaneOpen] = useState(false);

  const geoJSONString = JSON.stringify();
  const [data, setData] = useState(geoJSONString);

  //For clustering posts.
  const [distance, setDistance] = useState(50);
  const [selected, setSelected] = useState("Click a cluster for details");

  // For managing the user's current position.
  const [currentLatitude, setCurrentLatitude] = useState();
  const [currentLongitude, setCurrentLongitude] = useState();
  const [accuracy, setAccuracy] = useState();

  // For managing user clicks and date.
  const [selectedMapPosts, setSelectedMapPosts] = useState([]);
  const earthquakeLayer = useRef();

  const panAndZoomToMe = async () => {
    function showError(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          return "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          return "Location information is unavailable."
          break;
        case error.TIMEOUT:
          return "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          return "An unknown error occurred."
          break;
      }
    }

    const successCallback = async (position) => {
      setCurrentLongitude(position.coords.longitude);
      setCurrentLatitude(position.coords.latitude);
      setView({ center: fromLonLat([position.coords.longitude, position.coords.latitude]), zoom: view.zoom+3 });
    };
    
    const errorCallback = async (error) => {
      alert(showError(error));
    };
    
    const id = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  useEffect(() => {
    let viewCenter = toLonLat(view.center);
    setCenterLatitude(viewCenter[1]);
    setCenterLongitude(viewCenter[0]);
  }, [view]);

  useEffect(() => {
    async function fetchData() {
      // fetch the data from the url, this will need to be updated to fetch posts from database.
      const geojson = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      // parse the data
      const parsedData = await JSON.stringify(geojson.json());
      // use the data
      setData(parsedData);
      console.log(parsedData); 
    }
    fetchData();
  }, []);

  return (
    <>
      <ControlPanel 
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        isPostPaneOpen={isPostPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
        isLoginPaneOpen={isLoginPaneOpen}
        setIsLoginPaneOpen={setIsLoginPaneOpen}
        panAndZoomToMe={panAndZoomToMe}
        
      />
      <RMap
        className="map"
        initial={view}
        view={[view, setView]}
        noDefaultControls={true}
      >
        <ROSM />
        <RControl.RAttribution />
        <RControl.RRotate />
        <RLayerVector>
          <RFeature geometry={new Point(fromLonLat([centerLongitude, centerLatitude]))} >
            <RStyle.RStyle>
              
              <RStyle.RCircle radius={5}>
                {/* <RStyle.RFill color="#F8F7F4" /> */}
                <RStyle.RStroke width="1" color="darkred" />
              </RStyle.RCircle>
            </RStyle.RStyle>
          </RFeature>
          <RFeature geometry={new Point(fromLonLat([centerLongitude, centerLatitude]))} >
            <RStyle.RStyle>
              
              <RStyle.RCircle radius={10}>
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
              // console.log(features);
              setSelectedMapPosts(features);
              setIsSelectedPaneOpen(true);
              // setSelected(
              //   `${features.length} earthquakes in this location, ` +
              //     `magnitudes are ${features
              //       .map((eq) => eq.get("mag"))
              //       .join(", ")}`
              // );
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
                      <RStroke color="rgba(0, 0, 0, 0.6)" width={3} />
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
              const mag = unclusteredFeature.get("mag");
              console.log(mag);
              // console.log(mag);
              return (
                <>
                  <RCircle radius="6">
                    <RFill color="rgba(255, 255, 255, 0.8)" />
                    <RStroke color="rgba(0, 0, 0, 1)" width={1.5} />
                  </RCircle>
                  <RText text={mag.toString()}>
                    <RFill color="#fff" />
                    <RStroke color="rgba(0, 0, 0, 0.6)" width={5} />
                  </RText>
                </>
              );
            }, [])}
          />
        </RLayerCluster>
        </RLayerVector>
      </RMap>
      <CenterMenu
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        isPostPaneOpen={isPostPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
        isLoginPaneOpen={isLoginPaneOpen}
        setIsLoginPaneOpen={setIsLoginPaneOpen}
        currentEmoji={currentEmoji}
        panAndZoomToMe={panAndZoomToMe}
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
      </SlidingPane>
      <SlidingPane
        closeIcon={<div>Close</div>}
        className="bottom-pane"
        from="bottom"
        isOpen={isSelectedPaneOpen}
        onRequestClose={() => {
          setIsSelectedPaneOpen(false);
        }}  
        width="100%"
      >
        <SelectedPosts
          selectedMapPosts={selectedMapPosts}
          setIsSelectedPaneOpen={setIsSelectedPaneOpen}
          isSelectedPaneOpen={isSelectedPaneOpen}
        ></SelectedPosts>
      </SlidingPane>
    </>
  )
};

export default MainMap;