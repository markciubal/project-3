import * as React from 'react';
import Map from 'react-map-gl';
// import { useContext } from 'react';
import '../App.css';
import ControlPanel from "./ControlPanel";
import { useMutation, useQuery } from '@apollo/client';
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
import Login from './Login';
import SignUp from './SignUp';
import postToGeoJSON from '../utils/postToGeoJSON';
import PostMap from './PostMap';
// Queries and Mutations
import { GET_ALL_POSTS } from '../utils/queries';
import "react-sliding-pane/dist/react-sliding-pane.css";
import CenterMenu from './CenterMenu';
const PinPoint = () => {
  // Map states.
  // Paired in [ LONGITUDE, LATITUDE ] because OpenLayers uses the pair (Longitude before Latitude, i.e., toLonLat, fromLonLat).
  const GEOGRAPHIC_CENTER_OF_UNITED_STATES = [44.967243, -103.771556];
  const [coordinateRoundTo, setCoordinateRoundTo] = React.useState(3);
  // const [view, setView] = React.useState({ center: fromLonLat(GEOGRAPHIC_CENTER_OF_UNITED_STATES), zoom: 3, extent: [-20037508.34, 20037508.34, 20037508.34, -20037508.34] });
  const [centerLatitude, setCenterLatitude] = React.useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[0]);
  const [centerLongitude, setCenterLongitude] = React.useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[1]);
  const [viewport, setViewport] = React.useState({
    latitude: GEOGRAPHIC_CENTER_OF_UNITED_STATES[0],
    longitude: GEOGRAPHIC_CENTER_OF_UNITED_STATES[1],
    width: "100vw",
    height: "100vh",
    zoom: 1
  });
  const [currentEmoji, setCurrentEmoji] = React.useState('▼');
  const [postGeoJSON, setPostGeoJSON] = React.useState({
    "type": "FeatureCollection",
    "metadata": {
      "title": "PinPoint Posts",
    },
    "features": []
  });
  // Bottom sliding pane state.
  const [isPostPaneOpen, setIsPostPaneOpen] = React.useState(false);
  const [isSignUpPaneOpen, setIsSignUpPaneOpen] = React.useState(false);
  const [isLoginPaneOpen, setIsLoginPaneOpen] = React.useState(false);
  const [isSelectedPaneOpen, setIsSelectedPaneOpen] = React.useState(false);

  const geoJSONString = JSON.stringify();

  //For clustering posts.
  const [distance, setDistance] = React.useState(50);
  const [selected, setSelected] = React.useState("Click a cluster for details");

  // For managing the user's current position.
  const [currentLatitude, setCurrentLatitude] = React.useState();
  const [currentLongitude, setCurrentLongitude] = React.useState();
  const [accuracy, setAccuracy] = React.useState();

  // For managing user clicks and date.
  const [selectedMapPosts, setSelectedMapPosts] = React.useState([]);

  // Getting posts.
  const { loading, error, data } = useQuery(GET_ALL_POSTS, {
    pollInterval: 2500
  });

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
    };
    
    const errorCallback = async (error) => {
      alert(showError(error));
    };
    
    const id = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }



  // React.useEffect(() => {
  //   let viewCenter = toLonLat(view.center);
  //   setCenterLatitude(viewCenter[1]);
  //   setCenterLongitude(viewCenter[0]);
  // }, [view]);

  
  React.useEffect(() => {
    async function getAllPosts() {
    if (!loading) {
      console.log(postGeoJSON);
      const postData = postToGeoJSON(data);
      setPostGeoJSON(postData);
      console.log(postGeoJSON);
      console.log(postData);
    }
  }
    getAllPosts();
  }, [data]);

  return (
    <>
    <div className="parentContainer">
      <ControlPanel 
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        isPostPaneOpen={isPostPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
        isLoginPaneOpen={isLoginPaneOpen}
        setIsLoginPaneOpen={setIsLoginPaneOpen}
        isSignUpPaneOpen={isSignUpPaneOpen}
        setIsSignUpPaneOpen={setIsSignUpPaneOpen}
        panAndZoomToMe={panAndZoomToMe}
      />
      <PostMap
       className="postMap"
        viewport={viewport}
        setViewport={setViewport}
        setCenterLatitude={setCenterLatitude}
        setCenterLongitude={setCenterLongitude}
        postGeoJSON={postGeoJSON}
        setSelectedMapPosts={setSelectedMapPosts}
        selectedMapPosts={selectedMapPosts}
        setIsSelectedPaneOpen={setIsSelectedPaneOpen}
        isSelectedPaneOpen={isSelectedPaneOpen}
        setIsPostPaneOpen={setIsPostPaneOpen}
       />
       {/* <CenterMenu
       centerLatitude={centerLatitude}
       centerLongitude={centerLongitude}
       coordinateRoundTo={coordinateRoundTo}
       isPostPaneOpen={isPostPaneOpen}
       setIsPostPaneOpen={setIsPostPaneOpen}
       isLoginPaneOpen={isLoginPaneOpen}
       setIsLoginPaneOpen={setIsLoginPaneOpen}
       isSignUpPaneOpen={isSignUpPaneOpen}
       setIsSignUpPaneOpen={setIsSignUpPaneOpen}
       panAndZoomToMe={panAndZoomToMe}/> */}
    </div>
      <SlidingPane
        closeIcon={<div>Close</div>}
        className="bottom-pane"
        from="bottom"
        isOpen={isSignUpPaneOpen}
        onRequestClose={() => {
          setIsSignUpPaneOpen(false);
        }}  
        width="100%"
      >
        <SignUp 
          setIsSignUpPaneOpen={setIsSignUpPaneOpen}
        />
      </SlidingPane>
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
        <Post 
          centerLatitude={centerLatitude}
          centerLongitude={centerLongitude}
          setIsPostPaneOpen={setIsPostPaneOpen}
          setPostGeoJSON={setPostGeoJSON}
          postGeoJSON={postGeoJSON}
        />
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
        <Login 
          setIsLoginPaneOpen={setIsLoginPaneOpen}
        />
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
          setSelectedMapPosts={selectedMapPosts}
          setIsSelectedPaneOpen={setIsSelectedPaneOpen}
          isSelectedPaneOpen={isSelectedPaneOpen}
        ></SelectedPosts>
      </SlidingPane>
       
    </>
  )
};

export default PinPoint;