'use strict';

class _Env {
  constructor(timed=false, trace=0, simulationDelay=100) {
    this.timed = timed;
    this.trace = trace; // trace= 0: no trace; 1: basic trace (simple log for outvars); 2: mid trace (simple log for all vars & table & chart for outvars); 3: deep trace (full log & table & chart for all vars)
    this.simulationDelay = simulationDelay;
    this._chart = '';
    this._table = '';
    this._charts = [];
  }

  static preEvalCallback(model) { // default callback: before starting evaluation
    //if(model.env.trace == 2) $('#trace').append('<hr> ListOutVars> ' + _Model.list(model.outvars) + '<hr>');
    //else if(model.env.trace == 3) $('#trace').append('<hr> ListVars> ' + _Model.list(model.vars) + '<hr>');
    if(model.env.trace > 1) {
      $('#trace').append('<div style="position:relative; left:10px; width:600px;">');
      $('#trace').append('<canvas id="traceCanvas" style="border:2px solid #FF9933;"></canvas>');
      $('#trace').append('</div>');
    }
    if(model.env.trace == 2) model.env._chart = new _Chart($("#traceCanvas"), model, model.outvars, true);
    else if(model.env.trace == 3) model.env._chart = new _Chart($("#traceCanvas"), model, model.vars, true);
    let t = '';
    if(model.env.trace > 1) t += '<table id="traceTable" border="1"><tr><td>time</td>';
    if(model.env.trace == 2) t += model.outvars.map(x => ('<td>' + x.name + '</td>')).join('') + '</tr>';
    else if(model.env.trace == 3) t += model.vars.map(x => ('<td>' + x.name + '</td>')).join('') + '</tr>';
    if(model.env.trace > 1) {
      $('#trace').append(t);
      model.env._table = document.getElementById("traceTable");
    }
  }

  static inEvalCallback1(model) { // default callback: before each evaluation step
    if(model.env.trace > 0) console.log('\n*** time step:' + _time);
  }

  static inEvalCallback2(model) { // default callback: after each evaluation step
    if(model.env.trace > 1) {
      let row = model.env._table.insertRow(-1);
      let cell = row.insertCell(0);
      cell.innerHTML = _time;
      cell.style.textAlign = 'right';
      if(model.env.trace == 2) model.outvars.forEach(x => { cell = row.insertCell(-1); cell.innerHTML = x.value; cell.style.textAlign = 'right'; })
      else if(model.env.trace == 3)  model.vars.forEach(x => { cell = row.insertCell(-1); cell.innerHTML = x.value; cell.style.textAlign = 'right'; })
    }
    if(model.env.trace > 1) model.env._chart.update();
    model.env._charts.forEach(chart => chart.update(model.env.timed));
  }

  static postEvalCallback(model) { // default callback: after completing evaluation
    model.env._charts.forEach(chart => chart.update());
  }

}
