'use strict';

class _Table {
  constructor(container, model, series) {
    this.container = container;
    let domEl = '_Table_' + _Table.count++;
    $('#'+container).append(`<table id='${domEl}' border='1'>`);
    this.domEl = $('#'+domEl);
    this.model = model;
    this.series = series;
    let row = this.domEl[0].insertRow(-1);
    this.series.forEach(x => { let cell = row.insertCell(-1); cell.innerHTML = x.name; })
    model.env._tables.push(this);
  }

  update() {
    let row = this.domEl[0].insertRow(-1);
    let cell;
    this.series.forEach(x => { cell = row.insertCell(-1); cell.innerHTML = x.value; })
  }
}

_Table.count = 0;
