_model_data = {
  time0: 0, time1: 10, timeD: 0.1,
  parameters: [
  ],
  variables: [
    { id: "cosx", eta: "() => cos(_time)", args: "[]" },
    { id: "sinx", eta: "() => sin(_time)*getFromWidget('slider1')", args: "[]" },
    { id: "clicked", eta: "() => getFromWidget('button1')", args: "[]" }]
};

_env_data = {
  simDelay: 100,
  trace: 0,
  title: "Trig",
  charts: [
    { title: "chart1", top: 70, left: 10,
      xaxis: { min: -1.5, max: 10.5, step: 1 },
      yaxis: { min: -1.5, max: 1.5, step: 0.5 },
      series: "[{ x: cosx, y: sinx }, cosx, sinx, clicked ]",
      lines: [{ show: true, color: 'red', width: 1 }, {}, {}, {color: 'blue', width: 1}],
      points: [{ show: true, color: 'green', size: 10, lastonly: true }] },
  ],
  tables: [
    { title: "table1", top: 450, left: 10,
      series: "[Time, cosx, sinx]",
      decimals: [0, 2, 2], alignments: ['right', 'right', 'right'], lastonly: [true, true, true] },
  ],
  buttons: [
    { title: "button1", top: 450, left: 200, height: 100,
      label: "click me", tooltip: "this is an example" },
  ],
  sliders: [
    { title: "slider1", top: 450, left: 350, height: 100,
      min: 0, max: 1, step: 0.1,
      tooltip: "this is an example" },
  ],
};
