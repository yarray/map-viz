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
import { Vector } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import styles from './styles/default_style.js';
// import worldData from '../../map_data/local/world.json';
import chinaData from '../../map_data/local/china.json';
import countiesData from '../../map_data/local/counties.json';

interface OpenlayersMapProps {
  mapUrl?: string;
  data?: Array<any>;
  chartOptions?: Object;
  chartOnClickCallBack?: Function;
}

const getDefaultStyle = function(feature) {
  return styles[feature.getGeometry().getType()];
};

const getAdminStyle = function(feature) {
  let style = getDefaultStyle(feature);
  style.getText().setText(feature.get('name'));
  return style;
};

const provincesSource = new GeoJSON().readFeatures(chinaData, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

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

  showCountiesRes = 2000;

  connectedCallback() {
    setTimeout(() => {
      var provinces = new VectorLayer({
        source: new Vector({
          features: provincesSource
        }),
        style: getAdminStyle,
        minResolution: this.showCountiesRes
      });
      var counties = new VectorLayer({
        source: new Vector({
          features: new GeoJSON().readFeatures(countiesData, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
        }),
        style: getAdminStyle,
        maxResolution: this.showCountiesRes
      });

      new Map({
        target: 'map',
        layers: [provinces, counties],
        view: new View({
          center: fromLonLat([114, 38]),
          zoom: 4
        })
      });
    }, 0);
  }

  public render() {
    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
  }
}
