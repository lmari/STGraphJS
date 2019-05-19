_model_data = {
  time0: 0, time1: 10, timeD: 0.1,
  parameters: [
    { id: "x0", val: [-1,1,1,-1,-1] },
    { id: "y0", val: [-1,-1,1,1,-1] },
  ],
  variables: [
    { id: "x", out: true, eta: () => cos(_time), args: "[]" },
    { id: "y", out: true, eta: () => sin(_time), args: "[]" },
    { id: "x1", out: true, eta: x0 => x0+cos(_time), args: "[x0]" },
    { id: "y1", out: true, eta: y0 => y0+sin(_time), args: "[y0]" },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: "Base",
  charts: [
    { title: "chart1", top: 70, left: 10, width: 400, height: 400,
      xaxis: { min: -1.5, max: 1.5, step: 0.5 },
      yaxis: { min: -1.5, max: 1.5, step: 0.5 },
      series: "[ { x: x1, y: y1 }, { x: x, y: y }, ]",
      lines: [ { show: true, color: 'red', width: 1, straight: true }, { show: false }, ],
      points: [ { show: false }, { show: true, color: 'green', size: 10, lastonly: true }, ] },
  ],
  tables: [
  ],
};
