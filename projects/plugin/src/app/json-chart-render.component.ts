import { Component, Input, AfterContentInit, ElementRef, inject, OnInit } from '@angular/core';
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
import { Pane } from '@rollthecloudinc/panels';
import { RefsResolverService } from './services/refs-resolver.service';

@Component({
    selector: 'amcharts5-plugin-json-chart-render',
    template: ` `,
    styles: [':host { height: 300px; display: block; }'],
    providers: [
      JsonChartContentHandler,
      RefsResolverService
    ]
})

export class JsonChartRenderComponent implements OnInit, AfterContentInit {

  private hostEl = inject(ElementRef);
  private handler = inject(JsonChartContentHandler);
  private tokenizerService = inject(TokenizerService);
  private refsResolver = inject(RefsResolverService);

  @Input()
  set settings(settings: Array<AttributeValue>) {
    this.settings$.next(settings);
  }

  @Input()
  set panes(panes: Array<Pane>) {
    this.panes$.next(panes);
  }

  @Input()
  set originPanes(originPanes: Array<Pane>) {
    this.originPanes$.next(originPanes);
  }

  @Input()
  set contexts(contexts: Array<InlineContext>) {
    this.contexts$.next(contexts);
  }

  @Input()
  tokens: Map<string, any>;

  @Input()
  set resolvedContext(resolvedContext: any) {
    this.resolvedContext$.next(resolvedContext);
  }

  private init$ = new Subject();
  private afterContentInit$ = new Subject<void>();
  private settings$ = new BehaviorSubject<Array<AttributeValue>>([]);
  private jsonChart$ = new BehaviorSubject<JsonChart>(undefined);
  private json$ = new BehaviorSubject<{}>({});
  private resolvedContext$ = new BehaviorSubject<any>(undefined);
  private refs$ = new BehaviorSubject<Map<string, any>>(undefined);
  readonly contexts$ = new BehaviorSubject<Array<InlineContext>>([]);
  readonly panes$ = new BehaviorSubject<Array<Pane>>([]);
  readonly originPanes$ = new BehaviorSubject<Array<Pane>>([]);
  private root: am5.Root;

  readonly jsonChartSub = this.settings$.pipe(
    switchMap(settings => this.handler.toObject(settings)),
    filter(jsonChart => !!jsonChart),
    tap(jsonChart => this.jsonChart$.next(jsonChart))
  ).subscribe();

  readonly renderSub = combineLatest([
    this.jsonChart$,
    this.refs$,
    this.resolvedContext$
  ]).pipe(
    map(([ jsonChart, refs ]) => ({ jsonChart, refs })),
    filter(({ jsonChart, refs }) => jsonChart.json !== undefined && jsonChart.json !== '' && !!refs),
    switchMap(({ jsonChart, refs }) => this.resolveContexts().pipe(
      map(tokens => ({ jsonChart, tokens, refs }))
    )),
  ).subscribe(({ jsonChart, tokens, refs }) => {
    console.log('jsonChart', jsonChart);
    console.log('tokens', tokens);
    console.log('refs', refs);
    if(tokens !== undefined) {
      this.tokens = tokens;
    }
    // @todo: Probably be a better approach unserialize and rebuild by replacing tokens recursively.
    const jsonString = this.replaceTokens(jsonChart.json);
    const json = JSON.parse(jsonString);
    json.refs = { ...(json.refs ? json.refs : {}), ...Array.from(refs.keys()).reduce((p, k) => ({ ...p, [k]: refs.get(k) }), {}) };
    this.json$.next(json);
  });

  readonly jsonSub = this.json$.pipe(
    filter(json => !!json),
    tap(json => this.renderChart({ json }))
  ).subscribe();

  protected readonly refsSub = combineLatest([
    this.jsonChart$,
    this.panes$,
    this.originPanes$,
    this.contexts$,
    this.init$
  ]).pipe(
    map(([jsonChart, panes, originPanes, contexts]) => ({ jsonChart, metadata: new Map<string, any>([ [ 'panes', [ ...(panes && Array.isArray(panes) ? panes : []), ...(originPanes && Array.isArray(originPanes) ? originPanes : []) ] ], [ 'contexts', contexts ] ]) })),
    switchMap(({ jsonChart, metadata }) => this.refsResolver.resolveRefs(jsonChart, metadata)),
    // tap(refs => console.log('my refs are', refs)),
    tap(refs => this.refs$.next(refs))
  ).subscribe();

  ngOnInit() {
    this.init$.next(undefined);
    this.init$.complete();
  }

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