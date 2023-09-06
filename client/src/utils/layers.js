export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'postPoints',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#4d7ec1',
      100,
      '#336cb9',
      750,
      '#1a59b0',
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'postPoints',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
  paint: {},
};

export const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'postPoints',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#fff',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#000',
  },
};