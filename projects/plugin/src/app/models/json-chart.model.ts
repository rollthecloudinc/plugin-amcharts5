export class JsonChart {
  json: string;
  refs?: Array<JsonChartRef> = [];
  constructor(data?: JsonChart) {
    if (data) {
      this.json = data.json;
      if (data.refs && Array.isArray(data.refs)) {
        this.refs = data.refs.map(ref => new JsonChartRef(ref));
      }
    }
  }
}

export class JsonChartRef {
  name: string;
  id: string;
  type: string;
  constructor(data?: JsonChartRef) {
    if (data) {
      this.name = data.name;
      this.id = data.id;
      this.type = data.type;
    }
  }
}