Adds content type to Quell editor for rendering JSON based Am Charts.

https://www.amcharts.com/docs/v5/concepts/serializing/

## Example

Create new panel page with source of data for a AM Charts 5 JSON chart.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 23 34 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/45f25995-cba7-44bf-938c-814e947fdc8f">

Create a datasource pane to populate the chart. This is a static data source but ANY data source can be used. The most relavant for our purposes will be AWS Opensearch search template.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 23 47 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/3f79906d-5624-4875-882c-adef5c522bf2">

Create a AM Charts 5 JSON pane. Add JSON of chart and reference to datasource pane used to populate refs dyncamically.

<img width="1440" alt="Screen Shot 2023-07-07 at 1 24 15 AM" src="https://github.com/rollthecloudinc/solid-amcharts5/assets/73197190/590e00d2-ecab-40bb-b737-b168ca61bc9b">
