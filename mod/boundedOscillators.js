_model_data = {
  time0: 0, time1: 100, timeD: 0.0025,
  parameters: [
    { id: "n", val: 3 },
    { id: "k", val: 0.02 },
    { id: "p0", val: [0.1,0.6,0.9] },
    { id: "y", val: array(3,0) },
  ],
  variables: [
    { id: "a", eta: (n,k,d) => k*(seq(n).map(i => d[i]/abs(d[i]^3)-d[i+1]/abs(d[i+1]^3))), args: "[n,k,d]" },
    { id: "v", phi: a => _this+a*_timeD, args: "[a]", init: "y" },
    { id: "p", phi: v => _this+v*_timeD, args: "[v]", init: "p0" },
    { id: "d", eta: (n,p) => conc(p[0], seq(n-1).map(i => p[i+1]-p[i]), 1-p[n-1]), args: "[n,p]" },
  ]
};

_env_data = {
  simDelay: 1,
  title: "Bounded oscillator",
  charts: [
    { title: "chart1", top: 100, left: 10, width: 400,
    xaxis: { min: 0.0, max: 1.0, step: 0.2 },
    yaxis: { min: -0.4, max: 0.4, step: 0.2 },
    series: "[{x:p, y:y}]",
    lines: [{ show: false }],
    points: [{ show: true, color: 'green', size: 10, lastonly: true }] },
  ],
  tables: [
  ],
};
