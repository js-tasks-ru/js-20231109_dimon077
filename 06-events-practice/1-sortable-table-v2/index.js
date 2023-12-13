import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.isSortLocally = true;
    this.sortField = sorted.id;
    this.sortOrder = sorted.order;
    this.arrowElement = this.createArrowElement(this.createArrowTemplate());
    this.lastSortField = this.subElements.header.querySelector(`[data-id="${this.sortField}"]`);

    this.renderArrowElement(this.lastSortField);
    this.setSortOrder(this.lastSortField, this.sortOrder);
    this.sort(this.sortField, this.sortOrder);

    this.addListeners();
  }

  createArrowTemplate = () => {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  createArrowElement = (template) => {
    const container = document.createElement('div');
    container.innerHTML = template;
    return container.firstElementChild;
  }

  renderArrowElement = (target) => {
    if (target) {
      target.append(this.arrowElement);
    }
  }

  setSortOrder = (target, order) => {
    if (target) {
      target.dataset.order = order;
    }
  }

  changeSortOrder = (targetNode) => {
    if (targetNode.dataset.order == 'asc') {
      this.sortOrder = 'desc';
      this.setSortOrder(targetNode, this.sortOrder);
      return;
    }

    if (targetNode.dataset.order == 'desc') {
      this.sortOrder = 'asc';
      this.setSortOrder(targetNode, this.sortOrder);
      return;
    }

    this.sortOrder = 'desc';
    this.setLastSortField(targetNode);
    this.renderArrowElement(targetNode);
    this.setSortOrder(targetNode, this.sortOrder);
    this.sort(targetNode.dataset.id, this.sortOrder);
  }

  sortOnClient = (sortField, order) => {
    this.sort(sortField, order);
  }

  setLastSortField = (node) => {
    if (this.lastSortField) {
      this.lastSortField.dataset.order = '';
      this.lastSortField.lastElementChild.remove();
    }
    this.lastSortField = node;
  }

  tablePointerdownHandler = (e) => {
    const sortNode = e.target.closest(`[data-sortable="true"]`);
    if (sortNode) {
      if (this.isSortLocally) {
        this.changeSortOrder(sortNode);
        this.sortOnClient(sortNode.dataset.id, this.sortOrder);
      } else {
        this.changeSortOrder(sortNode);
        this.sortOnServer(sortNode.dataset.id, this.sortOrder);
      }
    }
  }

  addListeners = () => {
    this.subElements.header.addEventListener('pointerdown', this.tablePointerdownHandler);
  }

  removeListeners = () => {
    this.subElements.header.removeEventListener('pointerdown', this.tablePointerdownHandler);
  }

  destroy = () => {
    this.remove();
    this.removeListeners();
  }
}
