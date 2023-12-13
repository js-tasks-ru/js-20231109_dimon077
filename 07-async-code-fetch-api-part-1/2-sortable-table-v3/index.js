import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    url,
    isSortLocally = false,
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, { data, sorted });

    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.start = 0;
    this.end = 30;

    if (!this.sortField) {
      this.sortField = this.headerConfig.find(item => item.sortable).id;
      this.sortOrder = 'asc';
      this.lastSortField = this.subElements.header.querySelector(`[data-id="${this.sortField}"]`);
      this.renderArrowElement(this.lastSortField);
      this.setSortOrder(this.lastSortField, this.sortOrder);
    }

    this.loadingLineElement = this.createElement(this.createLoadingLineTemplate());
    this.renderLoadingLineElement();

    this.render();
    this.addScrollListener();
  }

  createLoadingLineTemplate = () => {
    return `<div data-elem="loading" class="loading-line sortable-table__loading-line"></div>`;
  }

  renderLoadingLineElement = () => {
    this.element.append(this.loadingLineElement);
  }

  loadData = async () => {
    const url = new URL(this.url);
    url.searchParams.set('_embed', 'subcategory.category');
    if (!this.isSortLocally) {
      url.searchParams.set('_sort', this.sortField);
      url.searchParams.set('_order', this.sortOrder);
    }
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);

    const data = await fetchJson(url);
    return data;
  }

  render = async () => {

    this.start = 0;
    this.end = 30;
    this.subElements.body.innerHTML = '';
    this.element.classList.add('sortable-table_loading');
    const data = await this.loadData();
    this.element.classList.remove('sortable-table_loading');
    const body = this.createElement(this.createTableBodyTemplate(data));
    this.updateSortedBody(body.children);
    if (this.isSortLocally) {
      this.setLastSortField(this.lastSortField);
      this.renderArrowElement(this.lastSortField);
      this.setSortOrder(this.lastSortField, this.sortOrder);
      this.sort(this.sortField, this.sortOrder);
    }
  }

  addBodyData = async () => {
    this.element.classList.add('sortable-table_loading');
    const data = await this.loadData();
    this.data.push(...data);
    this.element.classList.remove('sortable-table_loading');
    const body = this.createElement(this.createTableBodyTemplate(data));
    this.subElements.body.append(...body.children);
    this.addScrollListener();
  }

  tableBodyScrollHandler = () => {
    if (this.subElements.body.getBoundingClientRect().bottom < document.documentElement.clientHeight) {
      console.log('load');
      this.start += 30;
      this.end += 30;
      this.addBodyData();
      this.removeScrollListener();
    }
  }

  addScrollListener = () => {
    document.addEventListener('scroll', this.tableBodyScrollHandler);
  }

  removeScrollListener = () => {
    document.removeEventListener('scroll', this.tableBodyScrollHandler);
  }

  sortOnServer(sortField, order) {
    this.sortField = sortField;
    this.sortOrder = order;
    this.render();
  }
}
