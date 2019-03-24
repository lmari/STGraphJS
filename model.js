'use strict';

var _time, _timeD, _this, _thread;

class _Model {
  constructor(env, time0=0, time1=10, timeD=1) {
    this.env = env;
    this.pars = [];
    this.vars = [];
    this.outvars = [];
    this.time0 = time0;
    this.time1 = time1;
    this.timeD = timeD;
    this.time = time0;
    this.Time = new Parameter("Time", this, time0);
  }

  static list(arr) { return arr.map(x => x.name).join(', '); }

  sortVars() {
    let sortedVars = [];
    let tempVars = [], tempVars2 = [];
    let somethingDone;
    for(var v of this.vars) { // first step: vars depending on pars only
      if((v.phiArgs.length == 0 || v.phiArgs.every(x => x instanceof Parameter))
      && (v.etaArgs.length == 0 || v.etaArgs.every(x => x instanceof Parameter))) sortedVars.push(v);
      else tempVars.push(v);
    }
    for(let v of tempVars) { // second step: state vars
      if(v.type == 2) sortedVars.push(v);
      else tempVars2.push(v);
    }
    tempVars = tempVars2;
    do { // subsequent steps
      somethingDone = false;
      tempVars2 = [];
      for(let v of tempVars) { // all still not sorted vars
        if((v.phiArgs.length > 0 && v.phiArgs.every(x => x instanceof Parameter || sortedVars.includes(x)))
        || (v.etaArgs.length > 0 && v.etaArgs.every(x => x instanceof Parameter || sortedVars.includes(x)))) {
          sortedVars.push(v);
          somethingDone = true;
        } else tempVars2.push(v);
      }
      tempVars = tempVars2;
    } while(somethingDone);
    if(tempVars.length > 0) window.alert('sortVars failed!')
    this.vars = sortedVars;
    this.outvars = sortedVars.filter(x => x.isOutput);
  }

  isFirstStep() { return this.time == this.time0; }

  eval() {
    this.sortVars();
    _Env.preEvalCallback(this);
    _timeD = this.timeD;
    if(this.env.timed) {
      this.time = this.time0;
      let _model = this;
      _thread = setInterval(function() { _model.evalHelper(); }, this.env.simulationDelay);
    } else {
      for(this.time = this.time0; this.time <= this.time1; this.time += this.timeD) this.evalHelper();
    }
    _Env.postEvalCallback(this);
  }

  evalHelper() {
    _time = this.Time.value = this.time;
    _Env.inEvalCallback1(this);
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalState(this.env.trace); });
    this.vars.forEach(x => x.evalEta(this.env.trace));
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalPhi(this.env.trace); });
    _Env.inEvalCallback2(this);
    if(this.env.timed) {
      this.time += this.timeD;
      if(this.time > this.time1) clearInterval(_thread);
    }
  }

  listVars() { return Model.list(this.vars); }
  showPars() { return this.pars.map(x => x.show()).join(', '); }
  showVars() { return this.vars.map(x => x.show()).join(', '); }
}


class X {}


class Parameter extends X {
  constructor(name, model, value) {
    super();
    this.name = name;
    this.model = model;
    this.value = value;
    model.pars.push(this);
  }

  show() { return this.name + ':' + this.value; }
}


class Variable extends X {
  constructor(name, model, isOutput=false) {
    super();
    this.name = name;
    this.model = model;
    this.isOutput = isOutput;
    this.type = 0; // 0: undefined; 1:algebraic; 2:state; 3:statewithout
    this.value = 0;
    this.state = 0;
    this.initState = 0;
    this.nextState = 0;
    this.phi = null;
    this.phiArgs = [];
    this.eta = null;
    this.etaArgs = [];
    model.vars.push(this);
    if(isOutput) model.outvars.push(this);
  }

  setAlgebraic(eta, etaArgs) {
    this.type = 1;
    this.eta = eta;
    this.etaArgs = etaArgs;
  }

  setState(phi, phiArgs, initState) {
    this.type = 2;
    this.phi = phi;
    this.phiArgs = phiArgs;
    this.initState = initState;
  }

  setStateWithOut(phi, phiArgs, initState, eta, etaArgs) {
    this.type = 3;
    this.phi = phi;
    this.phiArgs = phiArgs;
    this.initState = initState;
    this.eta = eta;
    this.etaArgs = etaArgs;
  }

  isUndefined() { return this.type == 0; }
  isAlgebraic() { return this.type == 1; }
  isState() { return this.type == 2; }
  isStateWithOut() { return this.type == 3; }

  evalState(trace) {
    if(this.isUndefined()) return;
    this.state = this.model.isFirstStep() ? (this.initState instanceof X ? this.initState.value : this.initState) : this.nextState;
    if(trace == 3) console.log(this.name + ' [evalState (state)]: ' + this.state);
  }

  evalEta(trace) {
    if(this.isUndefined()) return;
    if(this.isStateWithOut()) _this = this.state;
    this.value = this.isState() ? this.state : this.eta(...this.etaArgs.map(x => x instanceof X ? x.value : x));
    if(trace == 1 && this.isOutput) console.log(this.name + ': ' + this.value);
    else if(trace > 1) console.log(this.name + ' [evalEta (value)]: ' + this.value);
  }

  evalPhi(trace) {
    if(this.isUndefined()) return;
    _this = this.state;
    this.nextState = this.phi(...this.phiArgs.map(x => x instanceof X ? x.value : x));
    if(trace == 3) console.log(this.name + ' [evalPhi (nextState)]: ' + this.nextState);
  }

  show() { return this.name + ':' + this.value; }
}
