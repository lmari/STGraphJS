_model_data = {
  time0: 0, time1: 5, timeD: 1,
  parameters: [
    { id: "p0", val: [5,10] },
  ],
  variables: [
    { id: "a0", out: true, eta: "() => rand()", args: "[]" },
    { id: "a1", out: true, eta: "x => x+1", args: "[a0]" },
    { id: "a2", out: true, eta: "(x,y) => x+y", args: "[a0,a1]" },
    { id: "x0", out: true, phi: "() => _this", args: "[]", init: "rand()" },
    { id: "b0", out: true, eta: "p0 => [p0[0]+rand(),p0[1]+rand()]", args: "[p0]" },
    { id: "y0", out: true, phi: "() => _this+1", args: "[]", init: "seq(5)" },
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
      series: "[a0,x0]",
      decimals: [2,2], alignments: ['center','center'], lastonly: [true,true] },
  ],
};
