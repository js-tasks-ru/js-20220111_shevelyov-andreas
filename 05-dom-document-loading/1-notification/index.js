export default class NotificationMessage {
  static activeNotification;

  element;
  timerId;
  
  constructor(message, obj = {duration: 0, type: 'success'}) {
    this.message = message;
    this.durationSecond = (this.duration/1000) + 's';
    this.duration = obj.duration;
    this.type = obj.type;
    
    this.render();
  }

  template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration}">
      <div class="timer"></div>
      <div class="inner-wrapper">
      <div class="notification-header">Notification</div>
        <div class="notification-body">${this.message}</div>
      </div>
    </div>`;
  }
  
  render() {
    const tempElement = document.createElement('div');

    tempElement.innerHTML = this.template();

    this.element = tempElement.firstChild;
  }

  show(parent = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    parent.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.activeNotification = this;
  }

  remove() {
    clearTimeout(this.timerId);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }
}
