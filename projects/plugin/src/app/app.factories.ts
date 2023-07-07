import { ContentPlugin } from '@rollthecloudinc/content';
import { JsonChartContentHandler } from './handlers/json-chart-content.handler';
import { JsonChartRenderComponent } from './json-chart-render.component';
import { JsonChartEditorComponent } from './json-chart-editor.component';

export const pluginJsonChartContentPluginFactory  = ({ handler }: { handler: JsonChartContentHandler }) => {
  return new ContentPlugin<string>({
    id: 'amcharts5_json_chart',
    title: 'AMCharts 5 JSON Chart',
    selectionComponent: undefined,
    editorComponent: JsonChartEditorComponent,
    renderComponent: JsonChartRenderComponent,
    handler
  } as any);
};