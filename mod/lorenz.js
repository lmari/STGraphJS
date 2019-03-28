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
  timed: true, trace: 0,
  title: "Attrattore di Lorenz",
  charts: [
    { title: "chart1", top: 50, left: 10, series: "[{x:x, y:y}]", line: "(true, 'red', 0.5)" },
    { title: "chart2", top: 350, left: 10, series: "[{x:x, y:z}]", line: "(false)", points: "(true, 'green', 0.5)" },
    { title: "chart3", top: 650, left: 10, series: "[{x:y, y:z}]" },
  ],
  tables: [
  ],
};
