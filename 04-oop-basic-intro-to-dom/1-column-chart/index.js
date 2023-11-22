export default class ColumnChart {
  constructor(obj = {}) {
    const { data = [], label = '', link = '', value = 0, formatHeading = (data) => `$${data}` } = obj;

    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.chartHeight = 50;

    this.element = this.createElement(this.createTemplate());
    this.update(this.data);
  }

  createTemplate = () => {
    return `
        <div class="column-chart" style="--chart-height: 50">
          <div class="column-chart__title">${this.label}${this.createLinkTemplate(this.link)}</div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
            <div data-element="body" class="column-chart__chart"></div>
          </div>
        </div>
    `;
  }

  createElement = (template) => {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  showDataIsLoading = () => {
    this.element.classList.add('column-chart_loading');
  }

  createChartsTemplate = (data) => {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data
      .map(value =>
        `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${(value / maxValue * 100).toFixed(0)}%"></div>`
      )
      .join('');
  }

  createLinkTemplate = (link) => {
    if (!link) return ``;

    return `<a href="${link}" class="column-chart__link">View all</a>`
  }

  update = (data) => {
    if (data.length === 0) {
      this.showDataIsLoading();
      return;
    }

    const dataBody = this.element.querySelector('div[data-element="body"]');
    dataBody.innerHTML = this.createChartsTemplate(data);
  }

  destroy = () => {
    this.remove();
  }

  remove = () => {
    this.element.remove();
  }
}
