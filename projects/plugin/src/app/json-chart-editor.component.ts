import { Component, OnInit, forwardRef, inject } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AttributeTypes, AttributeSerializerService } from "@rollthecloudinc/attributes";
import { Pane } from '@rollthecloudinc/panels';
import { JsonChartContentHandler } from "./handlers/json-chart-content.handler";
import { JsonChart } from "./models/json-chart.model";
import { Subject, tap } from "rxjs";
import { JsonChartRefComponent } from "./json-chart-ref.component";

@Component({
  selector: 'amcharts5-plugin-json-chart-editor',
  templateUrl: 'json-chart-editor.component.html',
  styleUrls: ['json-chart-editor.component.scss'],
  providers: [
    JsonChartContentHandler
  ],
})

export class JsonChartEditorComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<JsonChartEditorComponent>);
  private dialogData: { panelFormGroup: UntypedFormGroup; paneIndex: number; pane: Pane } = inject(MAT_DIALOG_DATA);
  private handler = inject(JsonChartContentHandler);
  private attributeSerializer = inject(AttributeSerializerService);
  private jsonChart: JsonChart;
  readonly addRef$ = new Subject();
  bindableOptions: Array<string> = [];
  rows = 40;
  cols = 100;
  contentForm = new FormGroup({
    refs: new FormArray([]),
    json: new FormControl<string>('', Validators.required)
  });
  readonly addRefSub = this.addRef$.pipe(
    tap(() => {
      this.refs.push(this.createRef());
    })
  ).subscribe();
  get refs(): FormArray {
    return (this.contentForm.get('refs') as FormArray);
  }
  ngOnInit(): void {
    this.bindableOptions = (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).controls.reduce<Array<string>>((p, c) => (c.get('name').value ? [ ...p, c.get('name').value ] : [ ...p ]), []);
    if(this.dialogData.pane !== undefined) {
      this.handler.toObject(this.dialogData.pane.settings).subscribe((jsonChart: JsonChart) => {
        this.jsonChart = jsonChart;
        this.contentForm.get('json').setValue(this.jsonChart.json);
        if (jsonChart.refs) {
          jsonChart.refs.forEach(() => this.refs.push(this.createRef()));
        }
      });
    }
  }
  submit() {
    let paneIndex: number;
    if(this.dialogData.paneIndex === undefined) {
      (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).push(new FormGroup({
        contentPlugin: new UntypedFormControl('amcharts5_json_chart'),
        name: new UntypedFormControl(''),
        label: new UntypedFormControl(''),
        rule: new UntypedFormControl(''),
        settings: new UntypedFormArray([])
      }));
      paneIndex = (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).length - 1;
    } else {
      paneIndex = this.dialogData.paneIndex;
    }
    const paneForm = (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).at(paneIndex);
    const json = this.contentForm.get('json').value;
    const refs = this.contentForm.get('refs').value;

    const jsonChart = new JsonChart({ json, refs });

    (paneForm.get('settings') as UntypedFormArray).clear();
    const controls = this.handler.buildSettings(jsonChart).map(s => this.attributeSerializer.convertToGroup(s));
    controls.forEach(c => (paneForm.get('settings') as UntypedFormArray).push(c));

    this.dialogRef.close();
  }
  private createRef(): UntypedFormControl {
    return new UntypedFormControl('')
  }

}