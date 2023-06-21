import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { JsonChartModule } from './json-chart.module';
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
  ]
})
export class AppModule { 
  constructor() {
    console.log('amcharts5 plugin app module');
  }
}
