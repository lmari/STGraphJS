_model_data = {
  time0: 0, time1: 5, timeD: 1,
  parameters: [
    { id: "x0", val: [0,1,1,0,0] },
    { id: "y0", val: [0,0,1,1,0] },
  ],
  variables: [
    { id: "x", out: true, phi: "() => _this", args: "[]", init: "x0" },
    { id: "y", out: true, phi: "() => _this", args: "[]", init: "y0" },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: "Base",
  charts: [
    { title: "chart1", top: 70, left: 10, width: 400, height: 400,
      xaxis: { min: -0.5, max: 1.5, step: 0.5 },
      yaxis: { min: -0.5, max: 1.5, step: 0.5 },
      series: "[ { x: x, y: y } ]",
      lines: [ { show: true, color: 'red', width: 1 }, ],
      points: [ { show: true, color: 'green', size: 10, lastonly: true }, ] },
  ],
  tables: [
  ],
};
