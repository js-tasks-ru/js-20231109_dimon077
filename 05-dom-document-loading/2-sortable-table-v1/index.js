export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.headerKeys = this.headerConfig.map(({ id }) => id);
    this.createImgTemplate = this.headerConfig.find(({ id }) => id === "images")?.template;

    this.element = this.createElement(this.createHeaderTemplate(this.headerConfig), this.createTableBodyTemplate(this.data));
    this.subElements = {
      header: this.element.querySelector('[data-element="header"]'),
      body: this.element.querySelector('[data-element="body"]')
    }
  }

  createHeaderTemplate = (headerConfig) => {
    const headerFields = headerConfig
      .map(({ id, title, sortable }) =>
        `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"><span>${title}</span></div>`)
      .join('');

    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">${headerFields}</div>
    `;
  }

  createTableRowTemplate = (item) => {
    const rowData = this.headerKeys.map(key => key == 'images' ? this.createImgTemplate(item[key]) : `<div class="sortable-table__cell">${item[key]}</div>`).join('');

    return `<a href="/products/${item.id}" class="sortable-table__row">${rowData}</a>`
  }

  createTableBodyTemplate = (data) => {
    const tableData = data.map((item) => this.createTableRowTemplate(item)).join('');
    return `
      <div data-element="body" class="sortable-table__body">${tableData}</div>
    `;
  }

  createElement = (headerTemplate, bodyTemplate) => {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = `<div class="sortable-table">${headerTemplate + bodyTemplate}</div>`

    return elementContainer.firstElementChild;
  }

  sort = (field, sortType = 'asc') => {
    const index = this.headerKeys.indexOf(field);
    const sortedBody = [...this.subElements.body.children];

    const collatorAsc = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'upper' });
    const collatorDesc = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'lower' });

    if (sortType == 'asc') {
      sortedBody.sort((a, b) => collatorAsc.compare(a.children[index].textContent, b.children[index].textContent));
    } else if (sortType == 'desc') {
      sortedBody.sort((a, b) => collatorDesc.compare(b.children[index].textContent, a.children[index].textContent));
    }

    this.updateSortedBody(sortedBody);
  }

  updateSortedBody = (sortedBody) => {
    this.subElements.body.innerHTML = '';
    this.subElements.body.append(...sortedBody);
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    this.remove();
  }
}
