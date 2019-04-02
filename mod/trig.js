_model_data = {
  time0: 0, time1: 10, timeD: 0.1,
  parameters: [
  ],
  variables: [
    { id: "cosx", eta: "() => cos(_time)", args: "[]" },
    { id: "sinx", eta: "() => sin(_time)", args: "[]" }]
};

_env_data = {
  simDelay: 1,
  trace: 0,
  title: "Trig",
  charts: [
    { title: "chart1", top: 50, left: 10,
      xaxis: { min: -1.5, max: 10.5, step: 1 },
      yaxis: { min: -1.5, max: 1.5, step: 0.5 },
      series: "[{ x: cosx, y: sinx }, cosx, sinx ]",
      lines: [{ show: true, color: 'red', width: 1 }],
      points: [{ show: true, color: 'green', size: 10, lastonly: true }] },
  ],
  tables: [
    { title: "table1", top: 450, left: 10,
      series: "[model.Time, cosx, sinx]",
      decimals: [0, 2, 2], alignments: ['right', 'right', 'right'], lastonly: [true, true, true] },
  ],
};
