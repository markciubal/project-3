import * as React from 'react';
import {useRef} from 'react';
import {Map, Source, Layer} from 'react-map-gl';

import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../utils/layers';
import '../App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJvamVjdGNpdmlsaWFuIiwiYSI6ImNsbDduZWdzcDBzcGUzanNzcjdxamVicXMifQ.lVmATzvMkyZSxPthIay_mA'; // Set your mapbox token here

function PostMap(props) { 
  const mapRef = useRef(null);
  // selectedMapPosts={selectedMapPosts}
  // setIsSelectedPaneOpen={setIsSelectedPaneOpen}
  // isSelectedPaneOpen={
  const onClick = event => {
    console.log(props);
    props.setSelectedMapPosts(event.features)
    props.setIsSelectedPaneOpen(true);

  }
    
    // if (feature) {
    //   console.log(event);
    //   const clusterId = feature.properties.cluster_id;
  
    //   const mapboxSource = mapRef.current.getSource('postPoints');
  
    //   mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
    //     if (err) {
    //       return;
    //     }
  
    //     mapRef.current.easeTo({
    //       center: feature.geometry.coordinates,
    //       zoom,
    //       duration: 5000
    //     });
    //   });
    // };
    // }
   

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
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
      </Map>
    </>
  );
}

export default PostMap;