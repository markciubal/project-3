import React from "react";
import {useEffect, useState} from "react";

import ControlPanel from "./ControlPanel";
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
const COORDINATE_ROUND_PLACES = 3;
const MainMap = () => {
  // Paired in [ LONGITUDE, LATITUDE ] because OpenLayers uses the pair (Longitude before Latitude, i.e., toLonLat, fromLonLat).
  const GEOGRAPHIC_CENTER_OF_UNITED_STATES = [-103.771556, 44.967243];
  const [view, setView] = useState({ center: fromLonLat(GEOGRAPHIC_CENTER_OF_UNITED_STATES), zoom: 3 });
  const [centerLatitude, setCenterLatitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[0]);
  const [centerLongitude, setCenterLongitude] = useState(GEOGRAPHIC_CENTER_OF_UNITED_STATES[1]);

  useEffect(() => {
    let viewCenter = toLonLat(view.center);
    console.log(viewCenter);
    setCenterLatitude(viewCenter[1]);
    setCenterLongitude(viewCenter[0]);
  }, [view]);

  return (
    <>
      <ControlPanel centerLatitude={centerLatitude} centerLongitude={centerLongitude} />
      <RMap
        className="map"
        initial={view}
        view={[view, setView]}
      >
        <ROSM />
        <RLayerVector>
        <RFeature geometry={new Point(fromLonLat([centerLongitude, centerLatitude]))} >
        <RStyle.RStyle>
            <RStyle.RCircle radius={5}>
              <RStyle.RFill color="#000" />
            </RStyle.RCircle>
          </RStyle.RStyle>
          <ROverlay className="example-overlay">{`${centerLatitude.toFixed(COORDINATE_ROUND_PLACES)}, ${centerLongitude.toFixed(COORDINATE_ROUND_PLACES)}`}</ROverlay>
        </RFeature>
        </RLayerVector>
      </RMap>
    </>
  )
};

export default MainMap;