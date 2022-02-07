import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  fromDate = new Date('2020-01-06');
  toDate = new Date('2022-02-01');
  step = 20;
  start = 1;
  end = this.start + this.step;
  loading = false;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = "",
    isSortLocally = false
  } = {}) {
    this.headersConfig = headersConfig;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.data = Array.isArray(data) ? data : data.data;
    this.isSortLocally = isSortLocally;
    
    this.render();
  }

  async loadData(sort, order, start, end) {
    this.url.searchParams.append("from", this.fromDate.toISOString());
    this.url.searchParams.append("to", this.toDate.toISOString());
    this.url.searchParams.append("_sort", sort);
    this.url.searchParams.append("_order", order);
    this.url.searchParams.append("_start", start);
    this.url.searchParams.append("_end", end);

    this.element.classList.add('sortable-table_loading');

    const data = await fetchJson(this.url);

    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  update(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  addRows(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.getTableRows(data);
  }

  sortOnClient (id, order) {
    const sotredData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getTableRows(sotredData);
  }

  async sortOnServer (id, order) {
    const start = 1;
    const end = start + this.step;
    const data = await this.loadData(id, order, start, end);

    this.renderRows(data);
  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    const field = column.dataset.id;
 
    if (column) {
      const newOrder = column.dataset.order === "asc" ? "desc" : "asc";
      column.dataset.order = newOrder;

      if (this.isSortLocally) {
        this.sortOnClient(field, newOrder); 
      } else {
        this.sortOnServer(field, newOrder);
      }
    }
  };

  onWindowScroll = async() => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);
      this.update(data);

      this.loading = false;
    }
  };

  initEventListeners() { 
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener('scroll', this.onWindowScroll);
  }

  removeEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.onSortClick);
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
          </div>
        </div>
      </div>`;
  }

  async render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    const data = await this.loadData('title', 'asc', this.start, this.end);
    this.renderRows(data);
    this.initEventListeners();
  }

  async init() {
    const data = await this.loadData('title', 'asc', this.start, this.end);
    this.update(data);
  }

  renderRows(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
      this.addRows(data);
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru']);
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElemenet) => {
      accum[subElemenet.dataset.element] = subElemenet;

      return accum;
    }, {});
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
    document.removeEventListener('scroll', this.onWindowScroll);
  }
}
