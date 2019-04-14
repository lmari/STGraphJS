'use strict';

class _Table {
  constructor(model, data, series, containerId) {
    if(containerId) this.container = containerId;
    else {
      this.container = '_DivTable_' + _Table.count;
      $('body').append(`<div id='${this.container}'>`)
    }
    let container = $('#'+this.container);
    container.dialog({ autoOpen: true, width: !data.width ? 'auto' : data.width });
    container.dialog({ height: !data.height ? 'auto' : data.height });
    container.dialog({ position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    container.dialog('option', 'title', data.title);
    let domEl = '_Table_' + _Table.count++;
    container.append(`<table id='${domEl}' border='1'>`);
    this.domEl = $('#'+domEl);
    this.model = model;
    this.series = typeof series == 'string' ? eval(this.fixSeries(series)) : series;
    this.decimals = data.decimals;
    if(data.alignments) {
      let style = document.createElement('style');
      let s = '';
      data.alignments.forEach((x,i) => s += `#${domEl} tr td:nth-child(${i+1}) { text-align: ${x} } `);
      style.innerHTML = s;
      document.body.appendChild(style);
    }
    this.lastOnly = data.lastonly;
    this.onlyLasts = this.lastOnly != undefined ? this.lastOnly.reduce((x,y) => x && y, true) : false;
    this.init();
    let c = `$('#${this.container}').dialog('open')`;
    $('#widgetmenu').append(`<li onclick="${c}"><div>table: ${data.title}</div></li>`);
    model.env._tables.push(this);
  }

  /** fixSeries - Add a leading 'model.' to each series, so to localize it to the current model.
   * *** THIS ASSUMES THAT THE MODEL IS IN THE VARIABLE 'model':
   * *** HENCE IT IS NOT THE MOST GENERAL SOLUTION!!!
   * @param  {string} a string of the kind '[series,series2,...]'
   * @return {string} a string of the kind '[model.series1,model.series2,...]' */
  fixSeries(a) {
    let s = a.trim().slice(1, -1).trim().split(',');
    return '[' + s.map(i => 'model.' + i.trim()).join(',') + ']';
  }

  init() {
    let row = this.domEl[0].insertRow(-1);
    this.series.forEach(x => { let cell = row.insertCell(-1); cell.innerHTML = x.name; });
  }

  reset() {
    this.domEl.html('');
    this.init();
  }

  update() {
    let row;
    let cell;
    if(!this.onlyLasts || this.domEl[0].rows.length == 1) {
      row = this.domEl[0].insertRow(-1);
      this.series.forEach(x => row.insertCell(-1));
    }
    this.series.forEach((x,i) => {
      cell = (this.lastOnly && this.lastOnly[i]) ? this.domEl[0].rows[1].cells[i] : row.cells[i];
      cell.innerHTML = this.decimals ? x.value.toFixed(this.decimals[i]) : x.value;
    });
  }
}

_Table.count = 0;
