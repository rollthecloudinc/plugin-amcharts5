import { NgModule } from '@angular/core';
import { JsonChartRenderComponent } from './json-chart-render.component';
import { JsonChartContentHandler } from './handlers/json-chart-content.handler';
import { ContentPluginManager } from '@rollthecloudinc/content';
import { MaterialModule } from '@rollthecloudinc/material';
import { pluginJsonChartContentPluginFactory } from './app.factories';
import { CommonModule } from '@angular/common';
import { JsonChartEditorComponent } from './json-chart-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    JsonChartRenderComponent,
    JsonChartEditorComponent
  ],
  providers: [
    JsonChartContentHandler
  ],
  exports: [
    JsonChartRenderComponent,
    JsonChartEditorComponent
  ]
})
export class JsonChartModule { 
  constructor(
    cpm: ContentPluginManager,
    jsonChartHandler: JsonChartContentHandler
  ) {
    console.log('register amcharts5 json chart plugin');
    // @todo: lint not picking up register() because in plugin module base class.
    cpm.register(pluginJsonChartContentPluginFactory({ handler: jsonChartHandler }));
  }
}
