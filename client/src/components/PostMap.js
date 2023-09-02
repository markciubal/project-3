import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {Map, Marker, Source, Layer} from 'react-map-gl';
import Pin from './Pin';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../utils/layers';
import '../App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJvamVjdGNpdmlsaWFuIiwiYSI6ImNsbDduZWdzcDBzcGUzanNzcjdxamVicXMifQ.lVmATzvMkyZSxPthIay_mA'; // Set your mapbox token here
const PostMap = (props) => {
  const [pointData, setPointData] = useState(null);
  const mapRef = useRef();
  // selectedMapPosts={selectedMapPosts}
  // setIsSelectedPaneOpen={setIsSelectedPaneOpen}
  // isSelectedPaneOpen={
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
      setPointData(getCenter({center: [props.viewport.longitude, props.viewport.latitude], angle: Date.now() / 1000, radius: 20}))
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
        const coordinates = e.features[0].geometry.coordinates.slice();
        const feature = e.features[0];
         console.log(feature);
         props.setSelectedMapPosts(feature);
         props.setIsSelectedPaneOpen(true);
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
        // });
      // console.log("CLICKITY");
      // mapRef.current.on('click', 'clusters', (e) => {
      //   const features = mapRef.current.queryRenderedFeatures(e.point, {
      //   layers: ['clusters']
      //   });
        
      //   const clusterId = features[0].properties.cluster_id;
      //   const clusterSource = mapRef.current.getSource('postPoints');
      //   clusterSource.getClusterLeaves(clusterId, (error, features) => {
      //   if (!error) {
      //     props.setSelectedMapPosts(e.features);
      //     console.log('Cluster children:', features);
      //   }
      //   });
      // });
      });
   }
  }
  const pointLayer = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf'
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
          // console.log(props.viewport.latitude)
          // console.log(props.viewport);
         }}
        ref={mapRef}
        maxZoom={20}
      > 
      {/* {console.log(typeof props.postGeoJSON)}
        {clusters.map((cluster) => {
          // console.log(post.properties);
          // console.log(post.geometry.coordinates[1]);
          <Marker key={cluster.properties.id} latitude={cluster.geometry.coordinates[1]} longitude={cluster.geometry.coordinates[0]}>
            <Pin />
          </Marker>
        })} */}
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
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
      </Map>
    </>
  );
}

export default PostMap;