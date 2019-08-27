/* global $, trace, _Utils, _Env, _SP */
'use strict'

var _time, _timeD, _this, _thread // eslint-disable-line no-unused-vars

const ExecState = {
  READY: 0,
  EXECUTING: 1,
  PAUSED: 2
};

/** Core class dealing with a model. */
class _Model { // eslint-disable-line no-unused-vars

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
    if(trace>3) _Utils.logMsg('Initialization (with parsing)', 0);
    else if(trace>0) _Utils.logMsg('Initialization', 0);
    data.parameters.forEach(x => eval(`this.${x.id} = new Parameter("${x.id}", this, ${_Utils.isArray(x.val) ? "[" + x.val + "]" : x.val})`));
    data.variables.forEach(x => eval(`this.${x.id} = new Variable("${x.id}", this, ${x.out})`));
    for(let __x of data.variables) {
      let args = this.fixArgs(__x);
      if(__x.eta != undefined) {
        try {
          eval(`this.${__x.id}.setAlgebraic(${__x.eta}, ${args})`);
          if(trace>0) _Utils.logMsg(`${__x.id}.setAlgebraic(${__x.eta})`, 1);
        } catch(e) { _Utils.logErr('_Model.constructor()', `evaluation of the eta function of variable ${__x.id} failed\n${this.showArgs(args)}`, e); }
      }
      if(__x.phi != undefined) {
        let init = this.fixInit(__x.init);
        try {
          eval(`this.${__x.id}.setInitState('${init}')`);
          if(trace>0) _Utils.logMsg(`${__x.id}.setInitState('${init}')`, 1);
        } catch(e) { _Utils.logErr('_Model.constructor()', `evaluation of the init state of variable ${__x.id} failed`, e); }
        try {
          eval(`this.${__x.id}.setState(${__x.phi}, ${args}, ${init})`);
          if(trace>0) _Utils.logMsg(`this.${__x.id}.setState(${__x.phi})`, 1);
        } catch(e) { _Utils.logErr('_Model.constructor()', `evaluation of the phi function of variable ${__x.id} failed\n${this.showArgs(args)}`, e); }
      }
    }
    this.execState = ExecState.READY;
  }

  showPars(withValue = true) { return this.pars.map(x => x.show(withValue)).join(', '); }
  showVars(withValue = true) { return this.vars.map(x => x.show(withValue)).join(', '); }

  /** fixArgs - Add a leading 'this.' to each argument, so to localize it to the current model.
   * @param  {string} a string of the kind '[arg_1,arg_2,...], where each arg_i' is the id of a variable: numbers and functions are not allowed here
   * @return {string} a string of the kind '[this.arg_1,this.arg_2,...]' */
  fixArgs(a) {
    //let s = a.trim().slice(1, -1).trim();
    let s = _Utils.getFun(a.eta ? a.eta : a.phi)[0].trim();
    if(s.slice(0,1) == "(") s = s.slice(1, -1).trim();
    return (s.length == 0) ? '[]' : '[' + s.split(',').map(i => 'this.' + i).join(',') + ']';
  }

  /** fixInit - Add a leading 'this.' to init if required, so to localize it to the current model.
   * @param  {string} a string of the kind 'number' or 'function()' or 'variable', or an array of them
   * @return {string} a string of the kind 'number' or 'function()' or 'this.variable', or an array of them */
  fixInit(a) {
    let s = ('' + a).trim();
    if(_Utils.isNumberStr(s) || _Utils.isFunctionStr(s)) return s;
    if(_Utils.isVariableStr(s)) return 'this.' + s;
    if(_Utils.isArrayStr(s)) {
      s = s.slice(1, -1).trim();
      return '[' + s.split(',').map(i => _Utils.isVariable(i) ? 'this.' + i : i).join(',') + ']';
    }
    throw '_Model.fixInit(): ERROR_1.';
  }

  /** showArgs - Show the arguments of a function (eta or phi), as specified in initialization,
   * and their initial values.   * 
   * @param {string} args string of arguments */
  showArgs(args) {
    let s = args.trim();
    s = s.slice(1, -1).trim();
    if(s.length == 0) return '';
    let ret = '';
    s.split(',').forEach(i => ret += `${i}: ${eval(i).value}\n`);
    return ret;
  }

  /** sortVars - Sort the model variables according to their execution order. */
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
    if(tempVars.length > 0) throw '_Model.sortVars(): ERROR: sort failed.';
    this.vars = sortedVars;
    this.outvars = sortedVars.filter(x => x.isOutput);
  }

  isFirstStep() { return this.time == this.time0; }
  isLastStep() { return this.time == this.time1; }

  preExec(timed) {
    // eslint-disable-next-line no-useless-catch
    try {
      this.sortVars();
      if(trace>0) {
        _Utils.logMsg(`Parameters: ${this.showPars(false)}`, 0);
        _Utils.logMsg(`Sorted variables: ${this.showVars(false)}`, 0);
      }
      if(trace>1) _Utils.logMsg('Evaluation', 0);
    } catch(e) { throw e; }
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
    if(this.time <= this.time1) this.execState = ExecState.PAUSED;
  }

  restartExec(timed) {
    if(timed) {
      let _model = this;
      _thread = setInterval(function() { _model.evalHelper(timed, false); }, this.env.simulationDelay);
    } else {
      for(; this.time <= this.time1; this.time += this.timeD) this.evalHelper(timed, false);
      this.postExec();
    }
  }

  pauseExec() {
    clearInterval(_thread);
    this.execState = ExecState.PAUSED;
  }

  stopExec() {
    clearInterval(_thread);
    this.execState = ExecState.READY;
  }

  /** Core wrapper execution handler. 
   * @param {boolean} timed timed execution
   * @param {boolean} stepped stepped execution */
  evalHelper(timed, stepped) {
    this.execState = ExecState.EXECUTING;
    _time = this.Time.value = this.time;
    _Env.inEvalCallback1(this, timed);
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalState(); });
    this.vars.forEach(x => x.evalEta());
    this.vars.forEach(x => { if(x.isState() || x.isStateWithOut()) x.evalPhi(); });
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

}


const VarType = {
  UNDEFINED: 0,
  ALGEBRAIC: 1,
  STATE: 2,
  STATEWITHOUTPUT: 3
};

class X {

  constructor(name, model, value) {
    this.name = name;
    this.model = model;
    this.value = value;
  }

  isScalar() { return $.isNumeric(this.value); }

  show(withValue) { return this.name + (withValue ? (':' + this.value) : ''); }

}


class Parameter extends X {

  constructor(name, model, value) {
    super(name, model, value);
    model.pars.push(this);
  }
}


class Variable extends X { // eslint-disable-line no-unused-vars

  constructor(name, model, isOutput=false) {
    super(name, model, 0);
    this.isOutput = isOutput;
    this.type = 0;
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
    this.eta = _SP.fix(eta);
    this.etaArgs = etaArgs;
  }

  setState(phi, phiArgs, initState) {
    this.type = VarType.STATE;
    this.phi = _SP.fix(phi);
    this.phiArgs = phiArgs;
    this.initState = initState;
  }

  setStateWithOut(phi, phiArgs, initState, eta, etaArgs) {
    this.type = VarType.STATEWITHOUTPUT;
    this.phi = _SP.fix(phi);
    this.phiArgs = phiArgs;
    this.initState = initState;
    this.eta = _SP.fix(eta);
    this.etaArgs = etaArgs;
  }

  setInitState(initStateAsString) {
    this.initStateAsString = (initStateAsString.slice(0,4) == 'this') ? 'model' + initStateAsString.slice(4) : initStateAsString;
  }

  isUndefined() { return this.type == VarType.UNDEFINED; }
  isAlgebraic() { return this.type == VarType.ALGEBRAIC; }
  isState() { return this.type == VarType.STATE; }
  isStateWithOut() { return this.type == VarType.STATEWITHOUTPUT; }

  evalState() {
    if(this.isUndefined()) return;
    if(this.model.isFirstStep()) this.initState = eval(this.initStateAsString);
    this.state = this.model.isFirstStep() ? (this.initState instanceof X ? this.initState.value : this.initState) : this.nextState;
  }

  evalEta() {
    if(this.isUndefined()) return;
    if(this.isStateWithOut()) _this = this.state;
    this.value = this.isState() ? this.state : this.eta(...this.etaArgs.map(x => x instanceof X ? x.value : x));
    if(trace>1) _Utils.logMsg(this.name + ': ' + this.value, 1);
  }

  evalPhi() {
    if(this.isUndefined()) return;
    _this = this.state;
    this.nextState = this.phi(...this.phiArgs.map(x => x instanceof X ? x.value : x));
    if(trace>2) _Utils.logMsg(this.name + ' (nextState): ' + this.nextState, 1);
  }
  
}
