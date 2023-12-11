import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  constructor(obj = {}) {
    super(obj);
    const { url, range = { from: new Date(), to: new Date() } } = obj;

    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.subElements = {
      header: this.element.querySelector(`[data-element="header"]`),
      body: this.element.querySelector(`[data-element="body"]`)
    }

    this.update(this.range.from, this.range.to);
  }

  update = async (from, to) => {
    const url = new URL(this.url);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    const data = await fetchJson(url);

    this.data = Object.values(data);
    this.render(this.data);

    return data;
  }

  render = (data) => {
    if (data.length === 0) {
      this.showDataIsLoading();
      return;
    }

    this.element.classList.remove('column-chart_loading');
    this.subElements.body.innerHTML = this.createChartsTemplate(data);
  }
}
