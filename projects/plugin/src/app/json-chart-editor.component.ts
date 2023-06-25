import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AttributeTypes } from "@rollthecloudinc/attributes";
import { Pane } from '@rollthecloudinc/panels';
import { JsonChartContentHandler } from "./handlers/json-chart-content.handler";
import { JsonChart } from "./models/json-chart.model";

@Component({
  selector: 'amcharts5-plugin-json-chart-editor',
  templateUrl: 'json-chart-editor.component.html',
  providers: [
    JsonChartContentHandler
  ]
})

export class JsonChartEditorComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<JsonChartEditorComponent>);
  private dialogData: { panelFormGroup: UntypedFormGroup; paneIndex: number; pane: Pane } = inject(MAT_DIALOG_DATA);
  private handler = inject(JsonChartContentHandler);
  private jsonChart: JsonChart;
  rows = 40;
  cols = 100;
  contentForm = new FormGroup({
    json: new FormControl<string>('', Validators.required)
  });
  ngOnInit(): void {
    if(this.dialogData.pane !== undefined) {
      this.handler.toObject(this.dialogData.pane.settings).subscribe((jsonChart: JsonChart) => {
        this.jsonChart = jsonChart;
        this.contentForm.get('json').setValue(this.jsonChart.json);
      });
    }
  }
  submit() {
    if(this.dialogData.paneIndex === undefined) {
      (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).push(new FormGroup({
        contentPlugin: new UntypedFormControl('amcharts5_json_chart'),
        name: new UntypedFormControl(''),
        label: new UntypedFormControl(''),
        rule: new UntypedFormControl(''),
        settings: new UntypedFormArray(this.buildSettings())
      }));
    } else {
      const paneForm = (this.dialogData.panelFormGroup.get('panes') as UntypedFormArray).at(this.dialogData.paneIndex);
      (paneForm.get('settings') as UntypedFormArray).clear();
      this.buildSettings().forEach(s => {
        (paneForm.get('settings') as UntypedFormArray).push(s)
      });
    }
    this.dialogRef.close();
  }
  private buildSettings(): Array<UntypedFormGroup> {
    const json = this.contentForm.get('json').value;
    return [
      new FormGroup({
        name: new UntypedFormControl('json', Validators.required),
        type: new UntypedFormControl(AttributeTypes.Text, Validators.required),
        displayName: new UntypedFormControl('JSON', Validators.required),
        value: new UntypedFormControl(json, Validators.required),
        computedValue: new UntypedFormControl(json, Validators.required),
      }),
    ];
  }

}