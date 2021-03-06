_model_data = {
  time0: 0, time1: 100, timeD: 0.03125,
  parameters: [
    { id: "a", val: 0.2 },
    { id: "b", val: 0.2 },
    { id: "c", val: 5.7 },
    { id: "proj", val: [pi()/2-0.3,0.3] },
  ],
  variables: [
    { id: "x", phi: (y,z) => _this+(-y-z)*_timeD, init: "0" },
    { id: "y", phi: (a,x) => _this+(x+a*_this)*_timeD, init: "1" },
    { id: "z", phi: (b,c,x) => _this+(b+_this*(x-c))*_timeD, init: "1" },
    { id: "tt", eta: (proj,x,y,z) => map3dto2d([x,y,z],proj) },
    { id: "xx", eta: tt => tt[0] },
    { id: "yy", eta: tt => tt[1] },
  ]
};

_env_data = {
  simDelay: 1,
  trace: 0,
  title: "Rossler attractor",
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
    { title: "X,Y,Z orbit", top: 200, left: 450, width: 600,
      series: "[{x:xx, y:yy}]",
      lines: [{ show: false }],
      points: [{show: true, color: 'blue', size: 0.5}] },
  ],
  tables: [
  ],
};
