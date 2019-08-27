/* global $ */
'use strict'

class _Widget {
  constructor() {}

  setContainer(widget, data) {
    let container = $('#'+widget.container);
    container.dialog({ autoOpen: true, autoResize: true,
      width: !data.width ? 'auto' : data.width,
      height: !data.height ? 'auto' : data.height,
      position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    container.dialog('option', 'title', data.title);
    $('div.ui-dialog-titlebar').css({'font-size': '0.8em', 'height': '1em'});
  }

  setMenuItem(widget, data) {
    let c = `$('#${widget.container}').dialog('isOpen') ? $('#${widget.container}').dialog('close') : $('#${widget.container}').dialog('open');`;
    $('#widgetmenu').append(`<li onclick="${c}"><div>${widget.constructor.kind}: ${data.title}</div></li>`);
  }

  registerInputWidget(widget, data) {
    widget.model.env._inputWidgets[data.title] = widget;
  }

  static reset(type) {
    if(type.count > 0) {
      for(let i=0; i<type.count; i++) $('#_Div' + type.kind + '_' + i).remove();
      type.count = 0;
    }
  }
}

class _InputWidget extends _Widget { // eslint-disable-line no-unused-vars
  constructor() {
    super();
  }

  getValue() {
    throw "widget.js ERROR: This is an abstract method, that subclasses must implement."
  }
}
