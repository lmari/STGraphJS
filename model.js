'use strict';

var _time, _timeD, _this, _thread;

const ExecState = {
  READY: 0,
  EXECUTING: 1,
  PAUSED: 2
};

class _Model {
  constructor(env, data) {
    this.env = env;
    this.pars = [];
    this.vars = [];
    this.outvars = [];
    this.time0 = data.time0;
    this.time1 = data.time1;
    this.timeD = data.timeD;
    this.time = data.time0;
    this.Time = new Parameter("Time", this, data.time0);
    //for(let __x of data.parameters) eval(`this.${__x.id} = new Parameter("${__x.id}", this, ${__x.val})`);
    data.parameters.forEach(x => eval(`this.${x.id} = new Parameter("${x.id}", this, ${x.val})`));
    //for(let __x of data.variables) eval(`this.${__x.id} = new Variable("${__x.id}", this, ${__x.out})`);
    data.variables.forEach(x => eval(`this.${x.id} = new Variable("${x.id}", this, ${x.out})`));
    for(let __x of data.variables) {
      let args = this.fixArgs(__x.args);
      if(__x.eta != undefined) eval(`this.${__x.id}.setAlgebraic(${__x.eta}, ${args})`);
      if(__x.phi != undefined) {
        let init = this.fixInit(__x.init);
        eval(`this.${__x.id}.setInitState('${init}')`);
        eval(`this.${__x.id}.setState(${__x.phi}, ${args}, ${init})`);
      }
    }
    this.execState = ExecState.READY;
  }

  /** fixArgs - Add a leading 'this.' to each argument, so to localize it to the current model.
   * @param  {string} a string of the kind '[arg1,arg2,...]'
   * @return {string} a string of the kind '[this.arg1,this.arg2,...]' */
  fixArgs(a) {
    let s = a.trim().slice(1, -1).trim();
    return (s.length == 0) ? '[]' : '[' + s.split(',').map(i => 'this.' + i).join(',') + ']';
  }

  /** fixInit - Add a leading 'this.' to init if required, so to localize it to the current model.
   * @param  {string} a string of the kind 'number' or 'function()' or 'variable'
   * @return {string} a string of the kind 'number' or 'function()' or 'this.variable' */
  fixInit(a) {
    let s = a.trim();
    if($.isNumeric(s)) return s;
    if(s.slice(-1) == ')') return s;
    return 'this.' + s;
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

  preExec(timed) {
    this.sortVars();
    _timeD = this.timeD;
    this.initExec(timed);
  }

  initExec(timed) {
    _Env.preEvalCallback(this, timed);
    this.time = this.time0;
    this.execState = ExecState.READY;
  }

  postExec(timed) {
    _Env.postEvalCallback(this, timed);
    this.execState = ExecState.READY;
  }

  exec(timed) {
    this.preExec(timed);
    if(timed) {
      let _model = this;
      _thread = setInterval(function() { _model.evalHelper(timed, false); }, this.env.simulationDelay);
    } else {
      for(this.time = this.time0; this.time <= this.time1; this.time += this.timeD) this.evalHelper(timed, false);
    }
    this.postExec(timed);
  }

  steppedExec() {
    if(this.execState == ExecState.READY) this.initExec(false);
    this.evalHelper(false, true);
    this.execState = ExecState.PAUSED;
  }

  restartExec(timed) {
    if(timed) {
      let _model = this;
      _thread = setInterval(function() { _model.evalHelper(timed, false); }, this.env.simulationDelay);
    } else {
      for(; this.time <= this.time1; this.time += this.timeD) this.evalHelper(timed, false);
    }
    this.postExec();
  }

  pauseExec() {
    clearInterval(_thread);
    this.execState = ExecState.PAUSED;
  }

  stopExec() {
    clearInterval(_thread);
    this.execState = ExecState.READY;
  }

  evalHelper(timed, stepped) {
    this.execState = ExecState.EXECUTING;
    _time = this.Time.value = this.time;
    _Env.inEvalCallback1(this, timed);
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalState(this.env.trace); });
    this.vars.forEach(x => x.evalEta(this.env.trace));
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalPhi(this.env.trace); });
    _Env.inEvalCallback2(this, timed||stepped);
    if(timed) {
      this.time += this.timeD;
      if(this.time > this.time1) {
        clearInterval(_thread);
        this.postExec(timed);
      }
    } else if(stepped) {
      this.time += this.timeD;
      if(this.time > this.time1) this.postExec(false);
    }
  }

  listVars() { return Model.list(this.vars); }
  showPars() { return this.pars.map(x => x.show()).join(', '); }
  showVars() { return this.vars.map(x => x.show()).join(', '); }
}


const VarType = {
  UNDEFINED: 0,
  ALGEBRAIC: 1,
  STATE: 2,
  STATEWITHOUTPUT: 3
};

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
    this.type = 0;
    this.value = 0;
    this.state = 0;
    this.initState = 0;
    this.initStateAsString = '';
    this.nextState = 0;
    this.phi = null;
    this.phiArgs = [];
    this.eta = null;
    this.etaArgs = [];
    model.vars.push(this);
    if(isOutput) model.outvars.push(this);
  }

  setAlgebraic(eta, etaArgs) {
    this.type = VarType.ALGEBRAIC;
    this.eta = eta;
    this.etaArgs = etaArgs;
  }

  setState(phi, phiArgs, initState) {
    this.type = VarType.STATE;
    this.phi = phi;
    this.phiArgs = phiArgs;
    this.initState = initState;
  }

  setStateWithOut(phi, phiArgs, initState, eta, etaArgs) {
    this.type = VarType.STATEWITHOUTPUT;
    this.phi = phi;
    this.phiArgs = phiArgs;
    this.initState = initState;
    this.eta = eta;
    this.etaArgs = etaArgs;
  }

  setInitState(initStateAsString) {
    this.initStateAsString = (initStateAsString.slice(0,4) == 'this') ? 'model' + initStateAsString.slice(4) : initStateAsString;
  }

  isUndefined() { return this.type == VarType.UNDEFINED; }
  isAlgebraic() { return this.type == VarType.ALGEBRAIC; }
  isState() { return this.type == VarType.STATE; }
  isStateWithOut() { return this.type == VarType.STATEWITHOUTPUT; }

  evalState(trace) {
    if(this.isUndefined()) return;
    if(this.model.isFirstStep()) this.initState = eval(this.initStateAsString);
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
