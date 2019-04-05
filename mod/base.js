_model_data = {
  time0: 0, time1: 10, timeD: 1,
  parameters: [
  ],
  variables: [
    { id: "a0", out: true, eta: "() => rand()", args: "[]" },
    { id: "x0", out: true, phi: "() => _this", args: "[]", init: "rand()" },
  ]
};

_env_data = {
  simDelay: 1,
  trace: 0,
  title: "Base",
  charts: [
  ],
  tables: [
    { title: "time lap", top: 70, left: 10,
      series: "[a0,x0]",
      decimals: [2,2], alignments: ['center','center'], lastonly: [true,true] }
  ],
};
