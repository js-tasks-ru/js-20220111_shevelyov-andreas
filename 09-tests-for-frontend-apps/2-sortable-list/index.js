export default class SortableList {
  constructor({items = []} = {}) {
    this.items = items;
    this.render();
  }

  render() {
    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';

    this.addItems();
    this.initEventListeners();
  }

  addItems() {
    for (const item of this.items) {
      item.classList.add('sortable-list__item');
    }

    this.element.append(...this.items);
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', event => {
      this.onPointerDown(event);
    });
  }

  onPointerDown(event) {
    const element = event.target.closest('.sortable-list__item');

    if (element) {
      if (event.target.closest('[data-grab-handle]')) {
        event.preventDefault();

        this.dragStart(element, event);
      }

      if (event.target.closest('[data-delete-handle]')) {
        event.preventDefault();

        element.remove();
      }
    }
  }

  dragStart(element, {clientX, clientY}) {
    this.draggingElem = element;
    this.elementInitialIndex = [...this.element.children].indexOf(element);

    const {x, y} = element.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = element;

    this.pointerShift = {
      x: clientX - x,
      y: clientY - y
    };

    this.draggingElem.style.width = `${offsetWidth}px`;
    this.draggingElem.style.height = `${offsetHeight}px`;
    this.draggingElem.classList.add('sortable-list__item_dragging');

    this.placeholderElement = this.createPlaceholderElement(offsetWidth, offsetHeight);

    this.draggingElem.after(this.placeholderElement);
    this.element.append(this.draggingElem);
    this.moveDragElement(clientX, clientY);
    this.addDocumentEventListeners();
  }

  createPlaceholderElement(width, height) {
    const element = document.createElement('li');

    element.className = 'sortable-list__placeholder';
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    return element;
  }

  onPointerMove = ({clientX, clientY}) => {
    this.moveDragElement(clientX, clientY);

    const prevElement = this.placeholderElement.previousElementSibling;
    const nextElement = this.placeholderElement.nextElementSibling;

    const { firstElementChild, lastElementChild } = this.element;
    const { top: firstElementTop } = firstElementChild.getBoundingClientRect();
    const { bottom } = this.element.getBoundingClientRect();

    if (clientY < firstElementTop) {
      return firstElementChild.before(this.placeholderElement); 
    }

    if (clientY > bottom) {
      return lastElementChild.after(this.placeholderElement);
    }

    if (prevElement) {
      const { top, height } = prevElement.getBoundingClientRect();
      const middlePrevElement = top + height / 2;

      if (clientY < middlePrevElement) {
        return prevElement.before(this.placeholderElement);
      }
    }

    if (nextElement) {
      const {top, height} = nextElement.getBoundingClientRect();
      const middleNextElement = top + height / 2;
      
      if (clientY > middleNextElement) {
        return nextElement.after(this.placeholderElement);
      }
    }

    this.scrollIfCloseWindowEdge(clientY);
  }

  onPointerUp = () => {
    this.dragStop();
  }

  dragStop() {
    const placeholderIndex = [...this.element.children].indexOf(this.placeholderElement);

    this.draggingElem.style.cssText = '';
    this.draggingElem.classList.remove('sortable-list__item_dragging');
    this.placeholderElement.replaceWith(this.draggingElem);
    this.draggingElem = null;

    this.removeDocumentEventListeners();

    if (placeholderIndex !== this.elementInitialIndex) {
      this.dispatchEvent('sortable-list-reorder', {
        from: this.elementInitialIndex,
        to: placeholderIndex
      });
    }
  }

  addDocumentEventListeners() {
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp); 
  }

  removeDocumentEventListeners() {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp); 
  }

  moveDragElement(clientX, clientY) {
    this.draggingElem.style.left = `${clientX - this.pointerShift.x}px`;
    this.draggingElem.style.top = `${clientY - this.pointerShift.y}px`;
  }

  scrollIfCloseWindowEdge(clientY) {
    const scrollingValue = 10;
    const threshold = 20;

    if (clientY < threshold) {
      window.scrollBy(0, -scrollingValue);
    } else if (clientY > document.documentElement.clientHeight - threshold) {
      window.scrollBy(0, scrollingValue);
    }
  }

  dispatchEvent(type, details) {
    this.element.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      details
    }));
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeDocumentEventListeners();
    this.element = null;
  }
}