Adds content type to Quell editor for rendering JSON based Am Charts.

https://www.amcharts.com/docs/v5/concepts/serializing/

## Example

Load AM Charts 5 solid using a module context.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 29 49 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/a3b02e39-238e-4f1c-85ed-170edcc766a4">

Once AM Charts 5 solid is loaded new AM Charts 5 JSON pane option becomes available.

<img width="1439" alt="Screen Shot 2023-07-07 at 1 30 05 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/84d0e6e3-eb07-40d8-855b-4d0513d293be">

Create new panel page with source of data for a AM Charts 5 JSON chart.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 23 34 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/45f25995-cba7-44bf-938c-814e947fdc8f">

Create a datasource pane to populate the chart. This is a static data source but ANY data source can be used. The most relavant for our purposes will be AWS Opensearch search template.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 23 47 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/3f79906d-5624-4875-882c-adef5c522bf2">

Create a AM Charts 5 JSON pane. Add JSON of chart and reference to datasource pane used to populate refs dynamically.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 24 15 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/590e00d2-ecab-40bb-b737-b168ca61bc9b">
