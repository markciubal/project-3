import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";
import '../App.css';
import ControlPanel from "./ControlPanel";
import Post from './Post';
import SlidingPane from "react-sliding-pane";
import { Menu } from "@szhsin/react-menu";
import { fromLonLat } from "ol/proj";
import { toLonLat } from "ol/proj";
import { Geometry, Point } from "ol/geom";
import { Geolocation as OLGeoLoc } from "ol";
import "ol/ol.css";

import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  RGeolocation,
  ROverlay,
  RStyle,
  useOL,
} from "rlayers";
import locationIcon from "../locationIcon.svg";
import { RCircle, RFill } from "rlayers/style";
import CenterMenu from "./CenterMenu";
import "react-sliding-pane/dist/react-sliding-pane.css";

const MainMap = () => {
  // Map states.
  // Paired in [ LONGITUDE, LATITUDE ] because OpenLayers uses the pair (Longitude before Latitude, i.e., toLonLat, fromLonLat).
  const GEOGRAPHIC_CENTER_OF_UNITED_STATES = [-103.771556, 44.967243];
  const [coordinateRoundTo, setCoordinateRoundTo] = useState(3);
  const [view, setView] = useState({ center: fromLonLat(GEOGRAPHIC_CENTER_OF_UNITED_STATES), zoom: 3 });
  const [centerLatitude, setCenterLatitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[0]);
  const [centerLongitude, setCenterLongitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[1]);

  // Bottom sliding pane state.
  const [isPaneOpen, setIsPaneOpen] = useState(false);


  useEffect(() => {
    let viewCenter = toLonLat(view.center);
    console.log(viewCenter);
    setCenterLatitude(viewCenter[1]);
    setCenterLongitude(viewCenter[0]);
  }, [view]);

  return (
    <>
      <ControlPanel 
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        coordinateRoundTo={coordinateRoundTo}
        />
      <RMap
        className="map"
        initial={view}
        view={[view, setView]}
        noDefaultControls={true}
        maxZoom="15"
      >
        <ROSM />
        <RLayerVector>
          <RFeature geometry={new Point(fromLonLat([centerLongitude, centerLatitude]))} >
            <RStyle.RStyle>
              <RStyle.RCircle radius={7}>
                <RStyle.RFill color="#F8F7F4" />
                <RStyle.RStroke width="2" color="#000" />
              </RStyle.RCircle>
            </RStyle.RStyle>
            <ROverlay
              className="center-overlay"
              positioning="top-center">
                <CenterMenu
                  setIsPaneOpen={setIsPaneOpen}
                  centerLatitude={centerLatitude}
                  centerLongitude={centerLongitude}
                  coordinateRoundTo={coordinateRoundTo}>
                </CenterMenu>
              </ROverlay>
          </RFeature>
        </RLayerVector>
      </RMap>
      <SlidingPane
        closeIcon={<div>Close</div>}
        className="bottom-pane"
        from="bottom"
        isOpen={isPaneOpen}
        onRequestClose={() => {
          setIsPaneOpen(false);
        }}  
        width="100%"

      >
        <Post />
      </SlidingPane>
    </>
  )
};

export default MainMap;