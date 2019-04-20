_model_data = {
  time0: 0, time1: 50, timeD: 0.03125,
  parameters: [
  ],
  variables: [
    { id: "t0", phi: "() => _this", args: "[]", init: "sysTime()" },
    { id: "t1", out: true, eta: "x => sysTime()-x", args: "[t0]" },
    { id: "x", out: true, phi: "y => _this+(5*(y-_this))*_timeD", args: "[y]", init: "0" },
    { id: "y", out: true, phi: "(x,z) => _this+(-x*z+15*x-_this)*_timeD", args: "[x,z]", init: "1" },
    { id: "z", out: true, phi: "(x,y) => _this+(-1*_this+x*y)*_timeD", args: "[x,y]", init: "1" },
  ]
};

_env_data = {
  simDelay: 1,
  trace: 0,
  title: "Lorenz attractor",
  charts: [
    { title: "X,Y projection", top: 100, left: 10, width: 400,
      series: "[{x:x, y:y}]",
      lines: [{ show: true, color: 'red', width: 0.5 }] },
    { title: "X,Z projection", top: 350, left: 10, width: 400,
      series: "[{x:x, y:z}]",
      lines: [{ show: false }],
      points: [{show: true, color: 'green', size: 0.5}] },
    { title: "Y,Z projection", top: 600, left: 10, width: 400,
      series: "[{x:y, y:z}]" },
  ],
  tables: [
    { title: "time lapse", top: 30, left: 300, height: 120,
      series: "[t1]",
      decimals: [0], alignments: ['center'], lastonly: [true] }
  ],
};
