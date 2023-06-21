import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'amcharts5-plugin-json-chart-editor',
  templateUrl: 'json-chart-editor.component.html'
})

export class JsonChartEditorComponent {
  private dialogRef = inject(MatDialogRef<JsonChartEditorComponent>);
  rows = 40;
  cols = 100;
  contentForm = new FormGroup({
    json: new FormControl<string>('', Validators.required)
  });
  submit() {
    this.dialogRef.close();
  }
}