import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.isSortLocally;
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
    target.append(this.arrowElement);
  }

  setSortOrder = (target, order) => {
    target.dataset.order = order;
  }

  changeSort = (targetNode, sortField) => {
    if (targetNode.dataset.order == 'asc') {
      this.setSortOrder(targetNode, 'desc');
      this.sort(sortField, 'desc');
      return;
    }

    if (targetNode.dataset.order == 'desc') {
      this.setSortOrder(targetNode, 'asc');
      this.sort(sortField, 'asc');
      return;
    }

    this.setLastSortField(targetNode);
    this.renderArrowElement(targetNode, 'desc');
    this.setSortOrder(targetNode, 'desc');
    this.sort(sortField, 'desc');
  }

  setLastSortField = (node) => {
    this.lastSortField.dataset.order = '';
    this.lastSortField.lastElementChild.remove();
    this.lastSortField = node;
  }

  tablePointerdownHandler = (e) => {
    const sortNode = e.target.closest(`[data-sortable="true"]`);
    if (sortNode) {
      this.changeSort(sortNode, sortNode.dataset.id);
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
