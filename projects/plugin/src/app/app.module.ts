import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { JsonChartModule } from './json-chart.module';
import { SITE_NAME } from '@rollthecloudinc/utils';
@NgModule({
  imports: [
    BrowserModule,
    JsonChartModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
      AppComponent
  ],
  providers: [
    { provide: SITE_NAME, useValue: 'amcharts5_plugin' },
  ]
})
export class AppModule { 
  constructor() {
    console.log('amcharts5 plugin app module');
  }
}
