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
  timed: false, trace: 0,
  title: "Attrattore di Lorenz",
  charts: [
    { id: "chart1", series: "[{x:x, y:y}]", line: "(true, 'red', 0.5)" },
    { id: "chart2", series: "[{x:x, y:z}]", line: "(false)", points: "(true, 'green', 0.5)" },
    { id: "chart3", series: "[{x:y, y:z}]" },
  ],
  tables: [
  ],
};
