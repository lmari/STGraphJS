/* global $, trace, _time, _Utils, ExecState, env:writable, model:writable, _env_data, _model_data, _Model */
/* global _Widget, _Table, _Chart, _Button, _Slider */
'use strict'

let _fileLoader = document.createElement('INPUT')
_fileLoader.setAttribute('type', 'file')
_fileLoader.addEventListener('change', getFile)

function getFile() {
  if(_fileLoader.files.length == 0) return null;
  let reader = new FileReader();
  reader.onload = event => {
    let contents = event.target.result;
    eval(contents);
    env = new _Env(_env_data);
    env.setPageTitle();
    env.setMenuBar();
    model = new _Model(env, _model_data);
    env.setWidgets(model);
  };
  reader.readAsText(_fileLoader.files[0]);
}

let _barEnd
let _skipSteps
let _steps = 0

/** Default browser environment for executing models and dealing with widgets. */
class _Env {

  /** Constructor
   * @param {object} data, as in the _env_data variable of a model file */
  constructor(data) {
    this.data = data;
    this.simulationDelay = data.simDelay || 1;
    _skipSteps = data.skipSteps || 1;
    this.resetWidgets();
  }

  resetWidgets() {
    _Widget.reset(_Table); this._tables = [];
    _Widget.reset(_Chart); this._charts = [];
    _Widget.reset(_Button); this._buttons = [];
    _Widget.reset(_Slider); this._sliders = [];
    this._inputWidgets = {};
  }

  setPageTitle() {
    $('body').append('<h1 id="pageTitle" style="margin-top: 25px">');
    $('#pageTitle').html(this.data.title);
  }

  setMenuBar() {
    if($('#menubar').html()) {
      $('#menubar').remove();
      $('body').unbind('keydown');
    }
    $('body').append(`
    <div id="menubar" style="background-color:lightgray">
      <li onclick="_fileLoader.click()"><div>Load [L]</div></li>
      <li><div>Exec</div><ul>
        <li onclick="env.runKey()"><div>[1] Run</div></li>
        <li onclick="env.timedRunKey()"><div>[2] Timed run</div></li>
        <li onclick="env.steppedRunKey()"><div>[3] Stepped run</div></li>
        <li onclick="env.stopKey()"><div>[4] Stop</div></li>
      </ul></li>
      <li><div>Widgets</div><ul id="widgetmenu">
      </ul></li>
      <li><div id="progressbar"><div class="progress-label">_</div></div></li>
    </div>
    `);

    let env = this;
    $('body').keydown(function(event) {
      let k = event.which-48;
      if(k == 1) env.runKey();
      else if(k == 2) env.timedRunKey();
      else if(k == 3) env.steppedRunKey();
      else if(k == 4) env.stopKey();
      else if(k == 28) _fileLoader.click();
    });

    $('#progressbar').progressbar({
      change: function() {
        let v = $('#progressbar').progressbar('value');
        $('.progress-label').text(v == 0 ? '' : v+'/'+_barEnd);
      }
    });
  }

  /** Menubar finalization: to be run after having added all menuitems: currently called by setWidgets(). */
  fixMenuBar() {
    $('#menubar').menu({
      position: { my: 'left top', at: 'left bottom' },
      blur: function() {
        $(this).menu('option', 'position', { my: 'left top', at: 'left bottom' });
      },
      focus: function(e, ui) {
        if ($('#menubar').get(0) !== $(ui).get(0).item.parent().get(0)) {
          $(this).menu('option', 'position', { my: 'left top', at: 'right top' });
        }
      },
    });
  }

  setWidgets(model) {
    if(this.data.charts) this.data.charts.forEach(__x => new _Chart(model, __x, __x.series));
    if(this.data.tables) this.data.tables.forEach(__x => new _Table(model, __x, __x.series));
    if(this.data.buttons) this.data.buttons.forEach(__x => new _Button(model, __x));
    if(this.data.sliders) this.data.sliders.forEach(__x => new _Slider(model, __x));
    this.fixMenuBar();
    document.getElementById("spinner").style.display = "none";

  }

  runKey() {
    if(model.execState == ExecState.READY || model.execState == ExecState.EXECUTING) model.exec(false);
    else if(model.execState == ExecState.PAUSED) model.restartExec(false);
  }

  timedRunKey() {
    if(model.execState == ExecState.READY || model.execState == 3) model.exec(true);
    else if(model.execState == ExecState.EXECUTING) model.pauseExec();
    else if(model.execState == ExecState.PAUSED) model.restartExec(true);
  }

  steppedRunKey() {
    if(model.execState == ExecState.EXECUTING) model.pauseExec();
    else model.steppedExec();
  }

  stopKey() {
    model.stopExec();
  }

  /** @static preEvalCallback - Default callback: before starting evaluation
   * @param  {type} model       description
   * @param  {type} interactive description */
  static preEvalCallback(model, interactive) {
    if(interactive) ;
    model.env._charts.forEach(chart => chart.reset());
    model.env._tables.forEach(table => table.reset());
    _barEnd = Math.round((model.time1+model.timeD-model.time0)/model.timeD);
    $('#progressbar').progressbar('value', '0');
    $('#progressbar').progressbar('option', 'max', _barEnd);
  }

  /** @static inEvalCallback1 - Default callback: before each evaluation step.
   * @param  {_Model} model
   * @param  {Boolean} interactive */
  static inEvalCallback1(model, interactive) {
    if(model || interactive) ;
    if(trace>1) _Utils.logMsg(`time step: + ${_time}`, 0);
  }

  /** @static inEvalCallback2 - Default callback: after each evaluation step.
   * @param {_Model} model
   * @param {Boolean} interactive */
  static inEvalCallback2(model, interactive) {
    let refresh = true;
    if(_skipSteps > 1) {
      _steps++;
      if(_steps == _skipSteps || model.isLastStep()) _steps = 0;
      else refresh = false;
    }
    model.env._charts.forEach(chart => chart.update(interactive && refresh));
    model.env._tables.forEach(table => table.update());
    if(interactive) $('#progressbar').progressbar('value', $('#progressbar').progressbar('value')+1);
  }

  /** @static postEvalCallback - Default callback: after completing evaluation.
   * @param {_Model} model
   * @param {Boolean} interactive */
  static postEvalCallback(model, interactive) {
    if(!interactive) model.env._charts.forEach(chart => chart.update(true));
    $('#progressbar').progressbar('value', '0');
  }

}
