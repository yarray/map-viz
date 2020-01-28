/**
 * WebCell疫情地图展示页面
 * 使用VirusMap组件构建疫情地图的示例，包含了国家级、省级不同粒度疫情地图的查看
 * @author: shadowingszy
 */

import { observer } from 'mobx-web-cell';
import { component, mixin, createCell, attribute, watch, on } from 'web-cell';
import { OpenlayersMap } from '../components/OpenlayersMap';
import mockData from '../../mock/map_viz_mock_data.js';

interface State {
  index: number;
}

@observer
@component({
  tagName: 'openlayers-map-viz',
  renderTarget: 'children'
})
export class OpenlayersMapViz extends mixin<{}, State>() {
  state = { index: 0 };

  getVirusMapConfig(index) {
    return {
      mapUrl: mockData[index].mapUrl,
      data: mockData[index].data,
      chartOnClickCallBack: function(params) {
        console.log(params);
      }
    };
  }

  public render({}, { index }: State) {
    const config = this.getVirusMapConfig(index);
    return (
      <div>
        <div style={{ width: '100%', height: '90%' }}>
          <OpenlayersMap
            mapUrl={config.mapUrl}
            data={config.data}
            chartOnClickCallBack={config.chartOnClickCallBack}
          />
        </div>
      </div>
    );
  }
}
