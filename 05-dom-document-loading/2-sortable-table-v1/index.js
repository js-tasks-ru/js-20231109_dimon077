export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.headerKeys = this.headerConfig.map(({ id }) => id);
    this.createImgTemplate = this.headerConfig.find(({ id }) => id === "images")?.template;

    this.element = this.createElement(this.createTableTemplate(this.createHeaderTemplate(this.headerConfig), this.createTableBodyTemplate(this.data)));
    this.subElements = {
      header: this.element.querySelector('[data-element="header"]'),
      body: this.element.querySelector('[data-element="body"]'),
      dataElements: this.element.querySelectorAll('[data-elements]')
    }
  }

  createHeaderCellTemplate = (id, title, sortable) => {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"><span>${title}</span></div>`;
  }

  createHeaderTemplate = (headerConfig) => {
    const headerFields = headerConfig
      .map(({ id, title, sortable }) =>
        this.createHeaderCellTemplate(id, title, sortable))
      .join('');

    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">${headerFields}</div>
    `;
  }

  createBodyCellTemplate = (value) => {
    return `<div class="sortable-table__cell">${value}</div>`;
  }

  createTableRowTemplate = (item) => {
    const rowData = this.headerKeys.map(key => key == 'images' ? this.createImgTemplate(item[key]) : this.createBodyCellTemplate(item[key])).join('');

    return `<a href="/products/${item.id}" class="sortable-table__row">${rowData}</a>`;
  }

  createTableBodyTemplate = (data) => {
    const tableData = data.map((item) => this.createTableRowTemplate(item)).join('');
    return `
      <div data-element="body" class="sortable-table__body">${tableData}</div>
    `;
  }

  createTableTemplate = (headerTemplate, bodyTemplate) => {
    return `<div class="sortable-table">${headerTemplate + bodyTemplate}</div>`;
  }

  createElement = (template) => {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = template;

    return elementContainer.firstElementChild;
  }

  sortAsc = (data, index) => {
    const collatorAsc = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'upper' });

    data.sort((a, b) => collatorAsc.compare(a.children[index].textContent, b.children[index].textContent));
  }

  sortDesc = (data, index) => {
    const collatorDesc = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'lower' });

    data.sort((a, b) => collatorDesc.compare(b.children[index].textContent, a.children[index].textContent));
  }

  sort = (field, sortType = 'asc') => {
    const index = this.headerKeys.indexOf(field);
    const sortedBody = [...this.subElements.body.children];

    if (sortType == 'asc') {
      this.sortAsc(sortedBody, index);
    }
    if (sortType == 'desc') {
      this.sortDesc(sortedBody, index);
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
