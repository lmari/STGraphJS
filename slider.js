'use strict';

class _Slider extends _Widget {
  constructor(model, data) {
    super();
    this.kind = 'Slider';
    this.container = '_DivSlider_' + _Slider.count;
    $('body').append(`<div id='${this.container}'>`);
    this.setContainer(this, data);
    let domEl = '_Slider_' + _Slider.count++;
    $('#'+this.container).append(`<div id='${domEl}' title='${data.tooltip}'><span id='h${domEl}' class='ui-slider-handle'></span></div>`);
    this.domEl = $('#'+domEl);
    this.domEl2 = $('#h' + domEl);
    this.boundFun;
    let me = this;
    this.domEl.slider({
      value: data.initialValue,
      min: data.min,
      max: data.max,
      step: data.step,
      create: function() { me.domEl2.text($(this).slider('value')); },
      slide: function(event, ui) { me.domEl2.text(ui.value); },
    });
    this.domEl.css({"width": "10em"});
    this.domEl2.css({"width": "2em", "height": "1.4em", "top": "50%", "margin-top": "-.7em", "text-align": "center", "line-height": "1.4em"});
    this.model = model;
    this.setMenuItem(this, data);
    this.registerInputWidget(this, data);
    model.env._sliders.push(this);
  }

  getValue() { return this.domEl.slider('value'); }

}

_Slider.count = 0;
