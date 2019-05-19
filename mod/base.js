_model_data = {
  time0: 0, time1: 5, timeD: 1,
  parameters: [
    { id: "p0", val: [5,10] },
  ],
  variables: [
    { id: "b0", eta: a0 => a0[0]+a0[1], args: "[a0]" },
    { id: "a0", eta: p0 => [p0[0]+rand(),p0[1]+rand()], args: "[p0]" },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 1,
  title: "Base",
  charts: [
  ],
  tables: [
    { title: "time lapse", top: 70, left: 10,
      series: "[b0]",
      decimals: [2], alignments: ['center'], lastonly: [false] },
  ],
};
