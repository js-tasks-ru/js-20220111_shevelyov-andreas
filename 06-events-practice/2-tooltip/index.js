class Tooltip {
  element;

  constructor() {
    if (Tooltip._instance) {
      return Tooltip._instance;
    }
    Tooltip._instance = this;
  }

  initialize () {
    this.setEventListeners();
  }

  render(text) {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');

    if (text) {
      this.element.innerHTML = text;
    }
    
    document.body.append(this.element);
  }

  pointerOver = event => {
    const tooltipValue = event.target.dataset.tooltip;

    if (tooltipValue) {
      this.render(tooltipValue);
      this.element.innerHTML = tooltipValue;
      document.body.addEventListener('pointermove', this.pointerMove);
    } 
  };

  pointerMove = event => {
    const tooltipValue = event.target.dataset.tooltip;

    if (tooltipValue) {
      this.element.style.top = `${Math.round(event.clientY + 10)}px`;
      this.element.style.left = `${Math.round(event.clientX + 10)}px`;
    } 
  };

  pointerOut = event => {
    if (this.element) {
      this.remove();
      document.body.removeEventListener('pointermove', this.pointerMove);
    }
  }

  setEventListeners() { 
    document.body.addEventListener('pointerover', this.pointerOver);
    document.body.addEventListener('pointerout', this.pointerOut);
  }

  removeEventListeners() {
    document.body.removeEventListener('pointerover', this.pointerOver);
    document.body.removeEventListener('pointerout', this.pointerOut);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}

export default Tooltip;
