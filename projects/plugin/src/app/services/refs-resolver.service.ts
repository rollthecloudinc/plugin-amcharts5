import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { JsonChart } from "../models/json-chart.model";
import { DatasourceContentHandler, Pane, PanelResolverService } from '@rollthecloudinc/panels';

@Injectable()
export class RefsResolverService {

  constructor(
    private datasourceContentHandler: DatasourceContentHandler,
    private panelResolver: PanelResolverService
  ) {}

  resolveRefs(instance: JsonChart, metadata?: Map<string,any>): Observable<Map<string, any>> {
    return of(instance).pipe(
      switchMap(i => !i.refs || i.refs.length === 0 ? of([]) : forkJoin(
        i.refs.map(r => 
          this.panelResolver.dataPanes(metadata.get('panes') as Array<Pane>).pipe(
            map(dataPanes => ({ dataPanes, dataPane: metadata.has('panes') ? (metadata.get('panes') as Array<Pane>).find(p => p.name === r.id) : undefined })),
            tap(() => console.log('before fetch')),
            switchMap(({ dataPanes, dataPane }) => dataPane ? this.datasourceContentHandler.fetchDynamicData(dataPane.settings, new Map<string, any>([ ...metadata, [ 'dataPanes', dataPanes ] ])) : of([])),
            tap(() => console.log('after fetch')),
            map(d => ({ r, results: d.results }))
          )
        )
      ))).pipe(
        map(refs => new Map<string, any>(refs.map(({ r, results }) => [ r.id, results ]))
      )
    );
  }

} 