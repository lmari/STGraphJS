'use strict';

class _Table {
  constructor(model, data, series, containerId) {
    if(containerId) this.container = containerId;
    else {
      this.container = '_DivTable_' + _Table.count;
      $('body').append(`<div id='${this.container}'>`)
    }
    let container = $('#'+this.container);
    container.dialog({ autoOpen: true, width: 'auto' });
    container.dialog('option', 'title', data.title);
    container.dialog({ position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    let domEl = '_Table_' + _Table.count++;
    container.append(`<table id='${domEl}' border='1'>`);
    this.domEl = $('#'+domEl);
    this.model = model;
    this.series = series;
    this.decimals = data.decimals;
    if(data.alignments) {
      let style = document.createElement('style');
      let s = '';
      data.alignments.forEach((x,i) => s += `#${domEl} tr td:nth-child(${i+1}) { text-align: ${x} } `);
      style.innerHTML = s;
      document.body.appendChild(style);
    }
    let row = this.domEl[0].insertRow(-1);
    this.series.forEach(x => { let cell = row.insertCell(-1); cell.innerHTML = x.name; })
    model.env._tables.push(this);
  }

  update() {
    let row = this.domEl[0].insertRow(-1);
    let cell;
    if(this.decimals) this.series.forEach((x,i) => { cell = row.insertCell(-1); cell.innerHTML = x.value.toFixed(this.decimals[i]); });
    else this.series.forEach(x => { cell = row.insertCell(-1); cell.innerHTML = x.value; })
  }
}

_Table.count = 0;
