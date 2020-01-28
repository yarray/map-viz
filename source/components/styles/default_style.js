import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Text from 'ol/style/Text';

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: 'red', width: 1 })
});

const polygon = new Style({
  stroke: new Stroke({
    color: 'rgba(120, 120, 100, 1)',
    width: 1
  }),
  fill: new Fill({
    color: 'rgba(220, 220, 200, 1)'
  }),
  text: new Text({
    font: '14px "Open Sans", "Arial Unicode MS", "sans-serif"',
    placement: 'point',
    fill: new Fill({
      color: 'rgba(60, 60, 60, 1)'
    })
  })
});

export default {
  Point: new Style({
    image: image
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  MultiPoint: new Style({
    image: image
  }),
  MultiPolygon: polygon,
  Polygon: polygon,
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new Fill({
      color: 'magenta'
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta'
      })
    })
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};
