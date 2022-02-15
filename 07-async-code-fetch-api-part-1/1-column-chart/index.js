import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    chartHeight = 50;
    subElements;

    constructor({url = "", range = {}, label = "", link = "", formatHeading = ()=>{}} = {}) {
      this.url = new URL(url, BACKEND_URL);
      this.range = range;
      this.label = label;
      this.link = link;
      this.formatHeading = formatHeading;


      this.render();
      if (this.range) {
        this.update(this.range.from, this.range.to);
      }
    }

    template() {
      return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          <a href='${this.link}' class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart">
          </div>
        </div>
      </div>
      `;
    }

    render() {
      const template = document.createElement('div');

      template.innerHTML = this.template();
      this.element = template.firstElementChild;
      this.subElements = this.getSubElements();
    }

    getChartChildren(data) {
      if (data.length > 0) {
        return data.map((currentValue) => {
          return `<div style='--value: ${String(Math.floor(currentValue * this.scale))}' data-tooltip='${(currentValue / this.maxValue * 100).toFixed(0)}%'></div>
          `;
        }).join('');
      }
    }

    getSubElements() {
      const elements = this.element.querySelectorAll('[data-element]');

      return [...elements].reduce(function(accum, currentValue) {
        accum[currentValue.dataset.element] = currentValue;

        return accum;
      }, {});
    }

    getValue() {
      if (this.formatHeading) {
        return this.formatHeading(this.value);
      }

      return this.value;
    }

    async loadData(dateFrom, dateTo) {
      this.url.searchParams.append("from", dateFrom.toISOString());
      this.url.searchParams.append("to", dateTo.toISOString());

      return await fetchJson(this.url);
    }

    async update(dateFrom, dateTo) {
      const dataObj = await this.loadData(dateFrom, dateTo);

      if (dataObj && Object.values(dataObj).length) {
        const data = [];
        for (let key in dataObj) {
          data.push(dataObj[key]);
        }

        if (data.length > 0) {
          this.value = data.reduce((previousValue, currentValue) => previousValue + currentValue);
          this.maxValue = Math.max(...data);
          this.scale = this.chartHeight / this.maxValue;

          this.subElements.body.innerHTML = this.getChartChildren(data);
          this.subElements.header.innerHTML = this.getValue();

          this.element.classList.remove('column-chart_loading');
        }
      }

      this.data = dataObj;
      return dataObj;
    }

    remove() {
      if (this.element) {
        this.element.remove();
      }
    }
    
    destroy() {
      this.remove();
      this.element = null;
      this.subElements = {};
    }
}
