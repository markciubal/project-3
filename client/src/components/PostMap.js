import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {Map, Marker, Source, Layer} from 'react-map-gl';
import Pin from './Pin';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../utils/layers';
import '../App.css';
import Auth from '../utils/auth'
// TODO: Move to .env file.
const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJvamVjdGNpdmlsaWFuIiwiYSI6ImNsbDduZWdzcDBzcGUzanNzcjdxamVicXMifQ.lVmATzvMkyZSxPthIay_mA'; // Set your mapbox token here
const PostMap = (props) => {
  // if (Auth.loggedIn()) {
  //   return (
  //       <>
  //       <Nav.Link onClick={() => { props.setIsPostPaneOpen(true)}}>Post</Nav.Link>
  const [pointData, setPointData] = useState(null);
  const mapRef = useRef();

  const bounds = mapRef.current
  ? mapRef.current
      .getMap()
      .getBounds()
      .toArray()
      .flat()
  : null;
  function getCenter({center, angle, radius}) {
    return {
      type: 'Point',
      coordinates: [center[0], center[1]]
    };
  }
  useEffect(() => {
    const animation = window.requestAnimationFrame(() =>
      setPointData(getCenter({center: [props.viewport.longitude, props.viewport.latitude]}))
    );
    return () => window.cancelAnimationFrame(animation);
  }, [props.viewport]);

  const onClick = event => {
    console.log(event);
    if (mapRef.current) {
      mapRef.current.on('click', ['clusters', 'unclustered-point'], (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        console.log(features);
        const clusterId = e.features[0].properties.cluster_id;
        const pointCount = e.features[0].properties.point_count;
        const clusterSource = mapRef.current.getSource('postPoints');
        // console.log(clusterSource);
        clusterSource.getClusterLeaves(clusterId, pointCount, 0, (error, features) => {
          // Print cluster leaves in the console
          console.log(features);
          props.setSelectedMapPosts(features);
          props.setIsSelectedPaneOpen(true);

        });
      });

      mapRef.current.on('click', 'unclustered-point', (e) => {
        const feature = e.features[0];
         console.log(feature);
         props.setSelectedMapPosts(feature);
         props.setIsSelectedPaneOpen(true);
      });

      mapRef.current.on('click', 'pinpoint', (e) => {
        if (Auth.loggedIn()) {
          props.setIsEditMode(false);
          props.setIsPostPaneOpen(true)
        }
      });
   }
  }
  const pointLayer = {
    id: 'pinpoint',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#0047a7',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#000'
    }
  };
  return (
    <>
      <Map
        {...props.viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        onMove={evt => { 
          props.setViewport(evt.viewState);
          props.setCenterLongitude(props.viewport.longitude);
          props.setCenterLatitude(props.viewport.latitude);
         }}
        ref={mapRef}
        maxZoom={20}
      > 
        <Source
          id="postPoints"
          type="geojson"
          data={props.postGeoJSON}
          cluster={true}  
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        {pointData && (
          <Source 
            id="pinpoint" 
            type="geojson"
            data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
      </Map>
    </>
  );
}

export default PostMap;