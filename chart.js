'use strict';

class _Chart {
  constructor(container, model, series) {
    this.container = container;
    let domEl = '_Chart_' + _Chart.count++;
    let s = '<div style="position:relative; left:10px; width:600px;">';
    s += `<canvas id="${domEl}" style="border:2px solid #FF9933;"></canvas>`;
    s += '</div>';
    $('#'+container).append(s);
    this.domEl = $('#'+domEl);
    this.model = model;
    this.series = series.map(s => s.x == undefined ? {x:this.model.Time, y:s} : s);
    var datasets = new Array();
    for(let i = 0; i < series.length; i++) datasets[i] = this.initDataset();
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

  initAxis() {
    return {
      ticks: { display: true },
      gridLines: { color: '#888', drawOnChartArea: true }
    }
  }

  update(withRefresh=true) {
    this.series.forEach((s,i) => this.chart.data.datasets[i].data.push({x: s.x.value, y: s.y.value}));
    if(withRefresh) this.chart.update();
  }

  setLine(show, color, width, dataset=0) {
    this.chart.data.datasets[dataset].showLine = show;
    this.chart.data.datasets[dataset].borderColor = color;
    this.chart.data.datasets[dataset].borderWidth = width;
  }

  setPoints(show, color, radius, dataset=0) {
    this.chart.data.datasets[dataset].pointRadius = show ? radius : 0;
    this.chart.data.datasets[dataset].pointBackgroundColor = color;
    this.chart.data.datasets[dataset].pointBorderColor = color;
  }
}

_Chart.count = 0;
