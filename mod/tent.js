_model_data = {
  time0: 0, time1: 50, timeD: 1,
  parameters: [
    { id: "x0", val: 0.5 },
    { id: "mu", val: 1.5 },
  ],
  variables: [
    { id: "x", phi: "mu => mu*min(_this,1-_this)", args: "[mu]", init: "x0" },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: "Tent map",
  charts: [
    { title: "chart1", top: 100, left: 10, width: 600,
      xaxis: { min: -0.5, max: 50.5, step: 5 },
      yaxis: { min: 0.0, max: 1.0, step: 0.2 },
      series: "[x]",
      lines: [{ show: true, color: 'red', width: 1 }],
      points: [{ show: true, color: 'green', size: 2, lastonly: false }] },
  ],
  tables: [
  ],
};
