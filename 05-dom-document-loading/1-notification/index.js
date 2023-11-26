export default class NotificationMessage {
  constructor(message = '', { duration = 0, type = 'success' } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.target = document.body;
    this.timeoutId;

    this.element = this.createElement(this.createTemplate());
  }

  createElement = (template) => {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate = () => {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;
  }

  show = (target = this.target) => {
    const notification = document.querySelector('.notification');

    if (notification) {
      notification.remove();
    }

    target.append(this.element);
    this.removeOnTimer(this.duration);
  }

  removeOnTimer = (duration) => {
    this.timeoutId = setTimeout(this.destroy, duration);
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    clearTimeout(this.timeoutId);
    this.remove();
  }
}
