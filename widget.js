'use strict';

class _Widget {
  constructor() {}

  setContainer(widget, data) {
    let container = $('#'+widget.container);
    container.dialog({ autoOpen: true, width: !data.width ? 'auto' : data.width });
    container.dialog({ height: !data.height ? 'auto' : data.height });
    container.dialog({ position: { my: "left top", at: `left+${data.left} top+${data.top}`, of: window } });
    container.dialog('option', 'title', data.title);
  }

  setMenuItem(widget, data) {
    let c = `$('#${widget.container}').dialog('open')`;
    $('#widgetmenu').append(`<li onclick="${c}"><div>${widget.kind}: ${data.title}</div></li>`);
  }

  registerInputWidget(widget, data) {
    widget.model.env._inputWidgets[data.title] = widget;
  }

}
