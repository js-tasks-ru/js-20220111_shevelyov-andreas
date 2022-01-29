export default class ColumnChart {
    element;
    chartHeight = 50;

    constructor(obj = {data: [], label: "", value: "", link: "", formatHeading: ()=>{}}) {
      this.data = obj.data || [];
      this.label = obj.label || "";
      this.value = obj.value || "";
      this.link = obj.link || "";
      this.formatHeading = obj.formatHeading;

      this.element = this.render();
    }

    template() {
      return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          <a href='${this.link}' class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.getValue()}</div>
          <div data-element="body" class="column-chart__chart">
              ${this.getChartChildren()}
          </div>
        </div>
      </div>
      `;
    }

    render() {
      const template = document.createElement('div');

      template.innerHTML = this.template();
      this.element = template.firstElementChild;

      if (this.data.length === 0) {
        this.element.classList.add('column-chart_loading');
      }

      return this.element;
    }

    getChartChildren() {
      let result = "";
      if (this.data.length > 0) {
        for( let i = 0; i < this.data.length; i++) {
          const maxValue = Math.max(...this.data);
          const scale = this.chartHeight / maxValue;

          result += `<div style='--value: ${String(Math.floor(this.data[i] * scale))}' data-tooltip='${(this.data[i] / maxValue * 100).toFixed(0)}%'></div> 
          `;
        }
      }

      return result;
    }

    getValue() {
      if (this.formatHeading) {
        return this.formatHeading(this.value);
      }

      return this.value;
    }

    update(obj) {
      this.data = obj.data || this.data;
      this.render;
    }

    remove() {
      this.element.remove();
    }
    
    destroy() {
      this.remove();
    }
}