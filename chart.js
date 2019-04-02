'use strict';

class _Chart {
  constructor(model, data, series, containerId) {
    if(containerId) { this.container = containerId; }
    else {
      this.container = '_DivChart_' + _Chart.count;
      $('body').append(`<div id='${this.container}'>`)
    }
    let container = $('#'+this.container);
    container.dialog({ autoOpen: true, width: 'auto' });
    container.dialog('option', 'title', data.title);
    container.dialog({ position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    let domEl = '_Chart_' + _Chart.count++;
    let s = '<div style="position:relative; left:10px; width:600px;">';
    s += `<canvas id="${domEl}" style="border:2px solid #FF9933;"></canvas>`;
    s += '</div>';
    container.append(s);
    this.domEl = $('#'+domEl);
    this.model = model;
    this.data = data;
    this.series = series.map(s => s.x == undefined ? {x:this.model.Time, y:s} : s);
    var datasets = new Array();
    for(let i = 0; i < series.length; i++) datasets[i] = this.initDataset(this.data);
    this.chart = new Chart(domEl, {
      type: 'scatter',
      data: { datasets: datasets },
      options: {
        legend: false,
        tooltips: false,
        animation: false,
        scales: { xAxes: [this.initAxis()], yAxes: [this.initAxis()] }
      }
    });
    if(data.xaxis != undefined) this.setAxis('x', data.xaxis);
    if(data.yaxis != undefined) this.setAxis('y', data.yaxis);
    if(data.lines != undefined) this.setLines(data.lines);
    if(data.points != undefined) this.setPoints(data.points);
    model.env._charts.push(this);
  }

  initDataset() {
    return {
      data: [],
      showLine: true,
      borderColor: 'black',
      borderWidth: 1,
      fill: false,
      pointRadius: 0,
      pointBackgroundColor: 'grey',
      pointBorderColor: 'grey',
      pointHoverRadius: 3,
    };
  }

  reset() {
    this.series.forEach((s,i) => this.chart.data.datasets[i] = this.initDataset());
    if(this.data.lines != undefined) this.setLines(this.data.lines);
    if(this.data.points != undefined) this.setPoints(this.data.points);
    this.chart.update();
  }

  initAxis() {
    return {
      ticks: { display: true },
      gridLines: { color: '#888', drawOnChartArea: true }
    }
  }

  setAxis(axis, data) {
    let a = axis == 'x' ? this.chart.options.scales.xAxes[0].ticks : this.chart.options.scales.yAxes[0].ticks;
    a.min = data.min;
    a.max = data.max;
    a.stepSize = data.step;
  }

  setLines(data) {
    data.forEach((d,i) => {
      let l = this.chart.data.datasets[i];
      l.showLine = d.show;
      l.borderColor = d.color;
      l.borderWidth = d.width;
    });
  }

  setPoints(data) {
    data.forEach((d,i) => {
      let l = this.chart.data.datasets[i];
      l.pointRadius = d.show ? d.size : 0;
      l.pointBackgroundColor = d.color;
      l.pointBorderColor = d.color;
      l.lastOnly = d.lastonly;
    });
  }

  update(withRefresh=true) {
    this.series.forEach((s,i) => {
      let d = this.chart.data.datasets[i];
      d.data.push({x: s.x.value, y: s.y.value});
      if(d.lastOnly) {
        let n = d.data.length;
        if(n == 1) d.pointRadius = [d.pointRadius];
        else {
          d.pointRadius[n-1] = d.pointRadius[n-2];
          d.pointRadius[n-2] = 0;
        }
      }
    });
    if(withRefresh) this.chart.update();
  }
}

_Chart.count = 0;
