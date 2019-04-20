'use strict';

class _Button extends _Widget {
  constructor(model, data) {
    super();
    this.kind = 'Button';
    this.container = '_DivButton_' + _Slider.count;
    $('body').append(`<div id='${this.container}'>`);
    this.setContainer(this, data);
    let domEl = '_Button_' + _Button.count++;
    $('#'+this.container).append(`<button id='${domEl}' title='${data.tooltip}' class='ui-button ui-widget ui-corner-all'>${data.label}</button>`);
    this.domEl = $('#'+domEl);
    this.model = model;
    // application logic
    this.val = 0;
    this.domEl.click(() => this.val = 1 - this.val);
    // end of application logic
    this.setMenuItem(this, data);
    this.registerInputWidget(this, data);
    model.env._buttons.push(this);
  }

  getValue() { return this.val; }

}

_Button.count = 0;
