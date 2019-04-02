'use strict';


class _Env {
  constructor(data) {
    this.trace = data.trace; // 0: no trace; 1: basic trace (simple log for outvars); 2: mid trace (simple log for all vars & table & chart for outvars); 3: deep trace (full log & table & chart for all vars)
    this.simulationDelay = data.simDelay;
    this.title = data.title;
    this._charts = [];
    this._tables = [];
  }

  setPageTitle() {
    $('body').append('<h1 id="pageTitle" style="margin-top: 25px">');
    $('#pageTitle').html(this.title);
  }

  setMenuBar() {
    $('body').append(`
    <div id="menubar">
    <li><div>Exec</div><ul>
      <li onclick="env.runKey()"><div>[1] Run</div></li>
      <li onclick="env.timedRunKey()"><div>[2] Timed run</div></li>
      <li onclick="env.steppedRunKey()"><div>[3] Stepped run</div></li>
      <li onclick="env.stopKey()"><div>[4] Stop</div></li>
    </ul></li>
    </div>
    `);

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

    let env = this;
    $('body').keydown(function(event) {
      let k = event.which-48;
      if(k == 1) env.runKey();
      else if(k == 2) env.timedRunKey();
      else if(k == 3) env.steppedRunKey();
      else if(k == 4) env.stopKey();
    });
  }

  runKey() {
    if(model.execState == 0 || model.execState == 3) model.exec(false);
    else if(model.execState == 2) model.restartExec(false);
  }

  timedRunKey() {
    if(model.execState == 0 || model.execState == 3) model.exec(true);
    else if(model.execState == 1) model.pauseExec();
    else if(model.execState == 2) model.restartExec(true);
  }

  steppedRunKey() {
    if(model.execState == 1) model.pauseExec();
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
    if(model.env.trace > 1) $('body').append('<div id="trace">');
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
      container.dialog({ position: { my: "left top", at: 'left top', of: window } });
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
