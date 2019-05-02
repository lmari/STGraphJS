'use strict';

let _fileLoader = document.createElement('INPUT');
_fileLoader.setAttribute('type', 'file');
_fileLoader.addEventListener('change', getFile);

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

/**
 * Default browser environment for executing models and dealing with widgets.
 */
class _Env {
  constructor(data) {
    this.data = data;
    this.trace = data.trace; // 0: no trace; 1: basic trace (simple log for outvars); 2: mid trace (simple log for all vars & table & chart for outvars); 3: deep trace (full log & table & chart for all vars)
    this.simulationDelay = data.simDelay;
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
  }

  fixMenuBar() { // must be run after having added all menuitems: currently called by setWidgets()
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

  static preEvalCallback(model, interactive) { // default callback: before starting evaluation
    //if(model.env.trace == 2) $('#trace').append('<hr> ListOutVars> ' + _Model.list(model.outvars) + '<hr>');
    //else if(model.env.trace == 3) $('#trace').append('<hr> ListVars> ' + _Model.list(model.vars) + '<hr>');
    model.env._charts.forEach(chart => chart.reset());
    model.env._tables.forEach(table => table.reset());
    if(model.env.trace > 1) {
      if($('#trace').length == 0) $('body').append('<div id="trace">');
      else $('#trace').html('');
    }
    if(model.env.trace == 2) {
      new _Chart(model, '', model.outvars, 'trace');
      new _Table(model, '', [model.Time].concat(model.outvars), 'trace');
    } else if(model.env.trace == 3) {
      new _Chart(model, '', model.vars, 'trace');
      new _Table(model, '', [model.Time].concat(model.vars), 'trace');
    }
    if(model.env.trace > 1) {
      let container = $('#trace');
      container.dialog({ autoOpen: true, width: 'auto' });
      container.dialog('option', 'title', 'Trace');
      container.dialog({ position: { my: "left top+70", at: 'left top', of: window } });
    }
  }

  static inEvalCallback1(model, interactive) { // default callback: before each evaluation step
    if(model.env.trace > 0) console.log('\n*** time step:' + _time);
  }

  static inEvalCallback2(model, interactive) { // default callback: after each evaluation step
    model.env._charts.forEach(chart => chart.update(interactive));
    model.env._tables.forEach(table => table.update());
  }

  static postEvalCallback(model, interactive) { // default callback: after completing evaluation
    if(!interactive) model.env._charts.forEach(chart => chart.update(true));
  }

}
