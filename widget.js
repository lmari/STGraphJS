'use strict';

class _Widget {
  constructor() {}

  setContainer(widget, data) {
    let container = $('#'+widget.container);
    container.dialog({ autoOpen: true, width: !data.width ? 'auto' : data.width });
    container.dialog({ height: !data.height ? 'auto' : data.height });
    container.dialog({ position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    container.dialog('option', 'title', data.title);
    $('div.ui-dialog-titlebar').css({'font-size': '0.75em', 'height': '0.9em'});
  }

  setMenuItem(widget, data) {
    let c = `$('#${widget.container}').dialog('open')`;
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

class _InputWidget extends _Widget {
  constructor() {
    super();
  }

  getValue() {
    throw "widget.js ERROR: This is an abstract method, that subclasses must implement."
  }
}
