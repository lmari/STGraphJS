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
  timed: true, trace: 0,
  title: "Capitale con interessi",
  charts: [
  ],
  tables: [
    { series: "[model.Time, capitale]" },
  ],
};
