_model_data = {
  time0: 0, time1: 100, timeD: 0.01,
  parameters: [
    { id: "k", val: 0.02 },
    { id: "p0", val: [0.7,0.9] },
  ],
  variables: [
    { id: "y", eta: () => array(2,0), args: "[]" },
    { id: "a", eta: (k,d) => k*(seq(2).map(i => d[i]/abs(d[i]^3)-d[i+1]/abs(d[i+1]^3))), args: "[k,d]" },
    { id: "d", eta: p => "conc(p[0], seq(1).map(i => p[i+1]-p[i]), 1-p[1])", args: "[p]" },
    { id: "v", phi: a => "_this+a*_timeD", args: "[a]", init: "array(2,0)" },
    { id: "p", phi: v => "_this+v*_timeD", args: "[v]", init: "p0" },
  ]
};

_env_data = {
  simDelay: 1,
  title: "Bounded oscillator",
  charts: [
    { title: "chart1", top: 100, left: 10, width: 400,
      xaxis: { min: -0.1, max: 1.1, step: 0.2 },
      yaxis: { min: -0.4, max: 0.4, step: 0.2 },
      series: "[{x:p, y:y}]",
      lines: [{ show: false, }],
      points: [{ show: true, color: 'green', size: 10, lastonly: true }] },
  ],
  tables: [
  ],
};
