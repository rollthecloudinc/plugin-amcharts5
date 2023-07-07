import { AfterViewInit, Component, forwardRef, inject, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators, FormBuilder } from "@angular/forms";
import { BehaviorSubject, Subject } from "rxjs";
import { tap} from 'rxjs/operators';
import { JsonChartRef } from "./models/json-chart.model";

@Component({
  selector: 'amcharts5-plugin-json-chart-ref',
  templateUrl: './json-chart-ref.component.html',
  // styleUrls: ['./json-chart-ref.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonChartRefComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JsonChartRefComponent),
      multi: true
    }
  ]
})
export class JsonChartRefComponent implements ControlValueAccessor, Validator, AfterViewInit, OnInit {

  private fb = inject(FormBuilder);

  @Input() set ref(v: JsonChartRef) {
    this.ref$.next(v);
  }

  @Input() set bindableOptions(bo: Array<string>) {
    this.bindableOptions$.next(bo);
  }

  readonly formGroup = this.fb.group({
    id: this.fb.control<string>('', Validators.required),
    name: this.fb.control<string>('', Validators.required),
    type: this.fb.control<string>('pane')
  });

  readonly afterViewInit$ = new Subject();
  readonly onInit$ = new Subject();
  readonly ref$ = new BehaviorSubject<JsonChartRef>(undefined);
  readonly bindableOptions$ = new BehaviorSubject<Array<string>>([]);

  readonly refSub = this.ref$.pipe(
    tap(v => {
      if (v) {
        this.formGroup.get('name').setValue(v.name);
        this.formGroup.get('id').setValue(v.id);
        this.formGroup.get('type').setValue(v.type);
      } else {
        this.formGroup.get('name').setValue('');
        this.formGroup.get('id').setValue('');
        this.formGroup.get('type').setValue('pane');
      }
    }),
  ).subscribe();

  public onTouched: () => void = () => {};

  ngOnInit() {
    this.onInit$.next(undefined);
    this.onInit$.complete();
  }

  ngAfterViewInit() {
    this.afterViewInit$.next(undefined);
    this.afterViewInit$.complete();
  }

  writeValue(val: any): void {
    if (val) {
      this.formGroup.setValue(val);
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable()
    } else {
      this.formGroup.enable()
    }
  }

  validate(c: AbstractControl): ValidationErrors | null{
    return this.formGroup.valid ? null : { invalidForm: {valid: false, message: "ref is invalid"}};
  }

}