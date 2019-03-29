_model_data = {
  time0: 0, time1: 10, timeD: 1,
  parameters: [
    { id: "c0", val: 1 },
    { id: "k", val: 0.1 }],
  variables: [
    { id: "interessi", eta: "(k,capitale) => k*capitale", args: "[k,capitale]" },
    { id: "capitale", out: true, phi: "interessi => _this+interessi*_this*_timeD", args: "[interessi]", init: "c0" }]
};

_env_data = {
  simDelay: 10,
  timed: true, trace: 3,
  title: "Capitale con interessi",
  charts: [
  ],
  tables: [
    { title: "capitale", top: 50, left: 10, series: "[model.Time, capitale]", decimals: [0, 2], alignments: ['right', 'center'] },
    { title: "interessi", top: 200, left: 300, series: "[model.Time, interessi]", decimals: [0, 3], alignments: ['left', 'right'] },
  ],
};
