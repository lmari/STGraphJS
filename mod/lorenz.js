_model_data = {
  time0: 0, time1: 50, timeD: 0.03125,
  parameters: [],
  variables: [
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
    { title: "X,Y projection", top: 100, left: 10,
      series: "[{x:x, y:y}]",
      lines: [{ show: true, color: 'red', width: 0.5 }] },
    { title: "X,Z projection", top: 400, left: 10,
      series: "[{x:x, y:z}]",
      lines: [{ show: false }],
      points: [{show: true, color: 'green', size: 0.5}] },
    { title: "Y,Z projection", top: 700, left: 10,
      series: "[{x:y, y:z}]" },
  ],
  tables: [
  ],
};
