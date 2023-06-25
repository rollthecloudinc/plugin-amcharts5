import { Injectable, inject } from '@angular/core';
import { ContentHandler, ContentBinding, ContentPluginEditorOptions } from '@rollthecloudinc/content';
import { AttributeSerializerService, AttributeValue } from '@rollthecloudinc/attributes';
import { Observable, of } from 'rxjs';
import { JsonChart } from '../models/json-chart.model';

@Injectable()
export class JsonChartContentHandler implements ContentHandler {
  private attributeSerializer = inject(AttributeSerializerService);

  handleFile(file: File): Observable<Array<AttributeValue>> {
    return of();
  }

  handlesType(type: string): boolean {
    return false;
  }

  implementsRendererOverride(): boolean {
    return false;
  }

  hasRendererOverride(settings: Array<AttributeValue>): Observable<boolean> {
    return of(false);
  }

  isDynamic(settings: Array<AttributeValue>): boolean {
    return false;
  }

  isData(settings: Array<AttributeValue>): boolean {
    return false;
  }

  getBindings(settings: Array<AttributeValue>, type: string, metadata?: Map<string, any>): Observable<Array<ContentBinding>> {
    return of([]);
  }

  fetchDynamicData(settings: Array<AttributeValue>, metadata: Map<string, any>): Observable<any> {
    return of();
  }

  buildDynamicItems(settings: Array<AttributeValue>, metadata: Map<string, any>): Observable<Array<AttributeValue>> {
    return of([]);
  }

  stateDefinition(settings: Array<AttributeValue>): Observable<any> {
    return of({});
  }

  editorOptions(settings: Array<AttributeValue>): Observable<ContentPluginEditorOptions> {
    return of(new ContentPluginEditorOptions({ fullscreen: true }));
  }

  toObject(settings: Array<AttributeValue>): Observable<JsonChart> {
    return of(new JsonChart(this.attributeSerializer.deserializeAsObject(settings)));
  }

}
