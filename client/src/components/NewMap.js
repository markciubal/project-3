import * as React from 'react';
import {useRef} from 'react';
import {Map, Source, Layer} from 'react-map-gl';

import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../utils/layers';
import '../App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJvamVjdGNpdmlsaWFuIiwiYSI6ImNsbDduZWdzcDBzcGUzanNzcjdxamVicXMifQ.lVmATzvMkyZSxPthIay_mA'; // Set your mapbox token here

function NewMap(props) {
  const mapRef = useRef(null);

  const onClick = event => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = mapRef.current.getSource('earthquakes');

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500
      });
    });
  };
  const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };
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
        {/* <Source
          id="earthquakes"
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source> */}
        <Source id="my-data" type="geojson" data={props.postGeoJSON}>
            <Layer {...layerStyle} />
        </Source>
      </Map>
    </>
  );
}

export default NewMap;