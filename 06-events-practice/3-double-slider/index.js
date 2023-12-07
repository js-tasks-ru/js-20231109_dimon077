export default class DoubleSlider {
  constructor({ min = 0, max = 100, formatValue = value => `${value}`, selected = {} } = {}) {
    this.min = min;
    this.max = max;
    this.from = selected.from != undefined ? selected.from : min;
    this.to = selected.to != undefined ? selected.to : max;
    this.formatValue = formatValue;
    this.leftPercent = (this.from - min) / ((max - min) / 100);
    this.rightPercent = 100 - (this.to - min) / ((max - min) / 100);

    this.element = this.createElement(this.createTemplate());

    this.subElements = {
      from: this.element.querySelector(`[data-element="from"]`),
      to: this.element.querySelector(`[data-element="to"]`),
      inner: this.element.querySelector(`[data-element="inner"]`),
      progress: this.element.querySelector(`[data-element="progress"]`),
      thumbLeft: this.element.querySelector(`[data-element="thumbLeft"]`),
      thumbRight: this.element.querySelector(`[data-element="thumbRight"]`)
    }

    this.addListneres();
  }

  createTemplate = () => {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${this.leftPercent}%; right: ${this.rightPercent}%;"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${this.leftPercent}%;"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${this.rightPercent}%;"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>
    `;
  }

  createElement = (template) => {
    const container = document.createElement('div');
    container.innerHTML = template;
    return container.firstElementChild;
  }

  calcLeftPercent = (value) => {
    return value / ((this.max - this.min) / 100);
  }

  calcRightPercent = (value) => {
    return 100 - value / ((this.max - this.min) / 100);
  }

  setFromValue = (value) => {
    this.subElements.from.textContent = this.formatValue(value);
  }

  setToValue = (value) => {
    this.subElements.to.textContent = this.formatValue(value);
  }

  setLeftPercent = (value) => {
    this.subElements.progress.style.left = value + '%';
    this.subElements.thumbLeft.style.left = value + '%';
  }

  setRightPercent = (value) => {
    this.subElements.progress.style.right = value + '%';
    this.subElements.thumbRight.style.right = value + '%';
  }

  thumbLeftPointermoveHandler = (e) => {
    let leftPercent = this.calcLeftPercent((e.clientX - this.subElements.inner.getBoundingClientRect().left) / (this.subElements.inner.getBoundingClientRect().width / 100));

    if (leftPercent < 0) {
      leftPercent = 0;
    }

    if (leftPercent > 100 - this.rightPercent) {
      leftPercent = 100 - this.rightPercent;
    }

    this.from = this.min + +((this.max - this.min) * leftPercent / 100).toFixed(0);
    this.leftPercent = leftPercent;

    this.setFromValue(this.from);
    this.setLeftPercent(this.leftPercent);
  }

  thumbLeftPointerupHandler = () => {
    this.addCustomEvent();
    document.removeEventListener('pointermove', this.thumbLeftPointermoveHandler);
    document.removeEventListener('pointerup', this.thumbLeftPointerupHandler);
  }

  thumbRightPointermoveHandler = (e) => {
    let rightPercent = this.calcRightPercent((e.clientX - this.subElements.inner.getBoundingClientRect().left) / (this.subElements.inner.getBoundingClientRect().width / 100));

    if (rightPercent < 0) {
      rightPercent = 0;
    }

    if (rightPercent > 100 - this.leftPercent) {
      rightPercent = 100 - this.leftPercent;
    }

    this.to = this.min + 100 - +((this.max - this.min) * rightPercent / 100).toFixed(0);
    this.rightPercent = rightPercent;

    this.setToValue(this.to);
    this.setRightPercent(this.rightPercent);
  }

  thumbRightPointerupHandler = () => {
    this.addCustomEvent();
    document.removeEventListener('pointermove', this.thumbRightPointermoveHandler);
    document.removeEventListener('pointerup', this.thumbRightPointerupHandler);
  }

  sliderInnerPointerdownHandler = (e) => {
    const thumb = e.target;

    if (thumb == this.subElements.thumbLeft) {
      document.removeEventListener('pointermove', this.thumbRightPointermoveHandler);
      document.addEventListener('pointermove', this.thumbLeftPointermoveHandler);
      document.addEventListener('pointerup', this.thumbLeftPointerupHandler);
    }

    if (thumb == this.subElements.thumbRight) {
      document.removeEventListener('pointermove', this.thumbLeftPointermoveHandler);
      document.addEventListener('pointermove', this.thumbRightPointermoveHandler);
      document.addEventListener('pointerup', this.thumbRightPointerupHandler);
    }
  }

  addListneres = () => {
    this.subElements.inner.addEventListener('pointerdown', this.sliderInnerPointerdownHandler);
  }

  removeListeners = () => {
    this.subElements.inner.removeEventListener('pointerdown', this.sliderInnerPointerdownHandler);
  }

  addCustomEvent = () => {
    const event = new CustomEvent('range-select', {
      detail: { from: this.from, to: this.to },
      bubbles: true
    });

    this.element.dispatchEvent(event);
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    this.remove();
    this.removeListeners();
  }
}
