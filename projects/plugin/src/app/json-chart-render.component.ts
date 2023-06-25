import { Component, Input, AfterContentInit, ElementRef, inject } from '@angular/core';
import { AttributeValue } from '@rollthecloudinc/attributes';
import { TokenizerService } from '@rollthecloudinc/token';
import { InlineContext } from '@rollthecloudinc/context';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, map, filter, tap, debounceTime } from 'rxjs/operators';
import * as am5 from "@amcharts/amcharts5/index";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import * as am5plugins_json from "@amcharts/amcharts5/plugins/json";
import { JsonChart } from './models/json-chart.model';
import { JsonChartContentHandler } from './handlers/json-chart-content.handler';

@Component({
    selector: 'amcharts5-plugin-json-chart-render',
    template: ` `,
    styles: [':host { height: 300px; display: block; }'],
    providers: [
      JsonChartContentHandler
    ]
})

export class JsonChartRenderComponent implements AfterContentInit {

  private hostEl = inject(ElementRef);
  private handler = inject(JsonChartContentHandler);
  private tokenizerService = inject(TokenizerService);

  @Input()
  set settings(settings: Array<AttributeValue>) {
    this.settings$.next(settings);
  }

  @Input()
  contexts: Array<InlineContext> = [];

  @Input()
  tokens: Map<string, any>;

  @Input()
  set resolvedContext(resolvedContext: any) {
    this.resolvedContext$.next(resolvedContext);
  }

  private afterContentInit$ = new Subject<void>();
  private settings$ = new BehaviorSubject<Array<AttributeValue>>([]);
  private jsonChart$ = new BehaviorSubject<JsonChart>(undefined);
  private json$ = new BehaviorSubject<{}>({});
  private resolvedContext$ = new BehaviorSubject<any>(undefined);
  private root: am5.Root;

  readonly settingsSub = combineLatest([
    this.settings$,
    this.resolvedContext$
  ]).pipe(
    switchMap(([settings, _]) => this.handler.toObject(settings)),
    filter(jsonChart => !!jsonChart && jsonChart.json !== undefined && jsonChart.json !== ''),
    switchMap(jsonChart => this.resolveContexts().pipe(
      map<Map<string, any>, [JsonChart, Map<string, any> | undefined]>(tokens => [jsonChart, tokens])
    )),
  ).subscribe(([jsonChart, tokens]) => {
    if(tokens !== undefined) {
      this.tokens = tokens;
    }
    this.jsonChart$.next(jsonChart);
    // @todo: Probably be a better approach unserialize and rebuild by replacing tokens recursively.
    const jsonString = this.replaceTokens(jsonChart.json);
    const json = JSON.parse(jsonString);
    this.json$.next(json);
  });

  readonly jsonSub = this.json$.pipe(
    filter(json => !!json),
    tap(json => this.renderChart({ json }))
  ).subscribe();

  ngAfterContentInit() {
    this.afterContentInit$.next();
    this.afterContentInit$.complete();
  }

  private replaceTokens(v: string): string {
    if(this.tokens !== undefined) {
      this.tokens.forEach((value, key) => {
        v = v.split(`[${key}]`).join(`${value}`)
      });
    }
    return v;
  }

  private resolveContexts(): Observable<undefined | Map<string, any>> {
    return new Observable(obs => {
      let tokens = new Map<string, any>();
      if(this.resolvedContext$.value) {
        for(const name in this.resolvedContext$.value) {
          tokens = new Map<string, any>([ ...tokens, ...this.tokenizerService.generateGenericTokens(this.resolvedContext$.value[name], name === '_root' ? '' : name) ]);
        }
      }
      obs.next(tokens);
      obs.complete();
    });
  }

  private renderChart({ json }: { json: {} }) {

    if (this.root) {
      this.root.dispose();
    }

    this.root = am5.Root.new(this.hostEl.nativeElement);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.root.setThemes([
      am5themes_Animated.new(this.root),
      am5themes_Dark.new(this.root)
    ]);
    
    // Specify date fields, so that they are formatted accordingly in tooltips
    // https://www.amcharts.com/docs/v5/concepts/formatters/data-placeholders/#Formatting_placeholders
    this.root.dateFormatter.setAll({
      dateFields: ["valueX"]
    });

    var parser = am5plugins_json.JsonParser.new(this.root);
    
    parser.parse(json, { parent: this.root.container }).then(chart => {
      // This kicks in when config is parsed
      (chart as any).series.getIndex(0).appear(1000);
      (chart as any).appear(1000, 100);
    });

  }

}