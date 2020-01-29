/**
 * WebCell地图可视化通用组件
 * 本地图组件为地图定制化开发提供了最高的自由度
 * @author: shadowingszy
 *
 * 传入props说明:
 * mapUrl: 地图json文件地址。
 * chartOptions: echarts中的所有options，注意，地图的map项值为'map'。
 * chartOnClickCallBack: 点击地图后的回调函数。
 *
 */

import { observer } from 'mobx-web-cell';
import { component, mixin, createCell, attribute, watch } from 'web-cell';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { XYZ, Vector } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import styles from './styles/default_style.js';
// import worldData from '../../map_data/local/world.json';
import provincesData from '../../map_data/local/provinces3857.json';
import citiesData from '../../map_data/local/cities3857.json';
import virusData from '../../mock/map_viz_mock_data.js';

interface OpenlayersMapProps {
  mapUrl?: string;
  data?: Array<any>;
  chartOptions?: Object;
  chartOnClickCallBack?: Function;
}

const virusDataFlat = {};

virusData.forEach(item => {
  item.data.forEach(province => {
    if (province.data) {
      province.data.forEach(city => {
        virusDataFlat[city.name] = city;
      });
    } else {
      virusDataFlat[province.name] = province;
    }
  });
});

const getDefaultStyle = function(feature) {
  return styles[feature.getGeometry().getType()];
};

const getAdminStyle = function(feature, base) {
  let style = styles[base];
  style.getText().setText(feature.get('name'));
  return style;
};

const getVirusColor = (value, topValue) => {
  const bottomColor = [240, 200, 200];

  // red decays not so fast so high values will be redder
  const r =
    bottomColor[0] - (value / topValue) * (value / topValue) * bottomColor[0];
  const g = bottomColor[1] - (value / topValue) * bottomColor[1];
  const b = bottomColor[2] - (value / topValue) * bottomColor[2];
  return `rgb(${r},${g},${b})`;
};

console.log(virusDataFlat);

const getVirusAdminStyle = (data, base, top) => feature => {
  let style = getAdminStyle(feature, base);
  let name = feature.get('name');
  if (name === '内蒙古自治区') {
    name = '内蒙古';
  } else if (name === '广西壮族自治区') {
    name = '广西';
  } else if (name === '西藏自治区') {
    name = '西藏';
  } else if (name === '宁夏回族自治区') {
    name = '宁夏';
  } else if (name === '新疆维吾尔自治区') {
    name = '新疆';
  } else if (name === '香港特別行政區') {
    name = '香港';
  } else if (name === '澳門特別行政區') {
    name = '澳门';
  } else if (base === 'Province') {
    name = name.slice(0, name.length - 1);
  }
  if (data[name]) {
    style.getFill().setColor(getVirusColor(data[name].confirmed, top));
  }
  return style;
};

const provincesSource = new GeoJSON().readFeatures(provincesData);
const citiesSource = new GeoJSON().readFeatures(citiesData);

@observer
@component({
  tagName: 'openlayers-map',
  renderTarget: 'children'
})
export class OpenlayersMap extends mixin<OpenlayersMapProps, {}>() {
  @attribute
  @watch
  mapUrl = '';

  @attribute
  @watch
  data = [];

  @attribute
  @watch
  chartOptions = {};

  @attribute
  @watch
  chartOnClickCallBack = param => {
    console.log(param);
  };

  detailRes = 5000;

  connectedCallback() {
    setTimeout(() => {
      var provinces = new VectorLayer({
        source: new Vector({
          features: provincesSource
        }),
        style: getVirusAdminStyle(virusDataFlat, 'Province', 100),
        minResolution: this.detailRes,
        declutter: true
      });
      var provincesBorder = new VectorLayer({
        source: new Vector({
          features: provincesSource
        }),
        style: styles['LineString'],
        maxResolution: this.detailRes
      });

      var cities = new VectorLayer({
        source: new Vector({
          features: citiesSource
        }),
        style: getVirusAdminStyle(virusDataFlat, 'City', 1000),
        maxResolution: this.detailRes
      });

      new Map({
        target: 'map',
        layers: [provinces, cities, provincesBorder],
        view: new View({
          center: fromLonLat([114, 38]),
          zoom: 4
        })
      });
    }, 100);
  }

  public render() {
    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
  }
}
