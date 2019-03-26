'use strict';

class _Env {
  constructor(timed=false, trace=0, simulationDelay=100) {
    this.timed = timed;
    this.trace = trace; // trace= 0: no trace; 1: basic trace (simple log for outvars); 2: mid trace (simple log for all vars & table & chart for outvars); 3: deep trace (full log & table & chart for all vars)
    this.simulationDelay = simulationDelay;
    this._charts = [];
    this._tables = [];
  }

  static preEvalCallback(model) { // default callback: before starting evaluation
    //if(model.env.trace == 2) $('#trace').append('<hr> ListOutVars> ' + _Model.list(model.outvars) + '<hr>');
    //else if(model.env.trace == 3) $('#trace').append('<hr> ListVars> ' + _Model.list(model.vars) + '<hr>');
    if(model.env.trace == 2) {
      new _Chart('trace', model, model.outvars, true);
      new _Table('trace', model, [model.Time].concat(model.outvars));
    } else if(model.env.trace == 3) {
      new _Chart('trace', model, model.vars, true);
      new _Table('trace', model, [model.Time].concat(model.vars));
    }
  }

  static inEvalCallback1(model) { // default callback: before each evaluation step
    if(model.env.trace > 0) console.log('\n*** time step:' + _time);
  }

  static inEvalCallback2(model) { // default callback: after each evaluation step
    model.env._charts.forEach(chart => chart.update(model.env.timed));
    model.env._tables.forEach(table => table.update());
  }

  static postEvalCallback(model) { // default callback: after completing evaluation
    model.env._charts.forEach(chart => chart.update());
  }

}
