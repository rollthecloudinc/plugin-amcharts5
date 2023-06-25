export class JsonChart {
  json: string;
  constructor(data?: JsonChart) {
    if (data) {
      this.json = data.json;
    }
  }
}