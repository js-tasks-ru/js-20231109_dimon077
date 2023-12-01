class Tooltip {
  static instance = null;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }

    this.target;
    this.element = this.createElement(this.createTemplate());
  }

  createTemplate = () => {
    return `<div class="tooltip"></div>`
  }

  createElement = (template) => {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = template;

    return elementContainer.firstElementChild;
  }

  initialize() {
    this.addListeners();
  }

  addMessage = (message) => {
    this.element.textContent = message;
  }

  render = (x, y, message) => {
    this.element.style.left = `${x + 5}px`;
    this.element.style.top = `${y + 5}px`;
    this.addMessage(message);
    document.body.append(this.element);
  }

  followCursor = (x, y) => {
    this.element.style.left = `${x + 5}px`;
    this.element.style.top = `${y + 5}px`;
  }

  pointeroverHandler = (e) => {
    const message = e.target.dataset.tooltip;

    if (message != undefined) {
      this.target = e.target;
      this.render(e.clientX, e.clientY, message);
      this.target.addEventListener('pointermove', (e) => {
        this.followCursor(e.x, e.y);
      });
    }
  }

  pointeroutHandler = (e) => {
    if (e.target == this.target) {
      this.target.removeEventListener('pointermove', (e) => {
        this.followCursor(e.x, e.y);
      });
      this.remove();
    }
  }

  addListeners = () => {
    document.addEventListener('pointerover', this.pointeroverHandler);
    document.addEventListener('pointerout', this.pointeroutHandler);
  }

  removeListeners = () => {
    document.removeEventListener('pointerover', this.pointeroverHandler);
    document.removeEventListener('pointerout', this.pointeroutHandler);
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    this.remove();
    this.removeListeners();
  }
}

export default Tooltip;
