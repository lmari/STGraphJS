_model_data = {
  time0: 0, time1: 100, timeD: 0.03125,
  parameters: [
    { id: "s", val: 5 },
    { id: "r", val: 15 },
    { id: "b", val: 1 },
    { id: "proj", val: [pi()/2-0.3,0.3] },
  ],
  variables: [
    { id: "t0", phi: () => _this, init: "sysTime()" },
    { id: "t1", eta: t0 => sysTime()-t0 },
    { id: "x", phi: (s,y) => _this+(s*(y-_this))*_timeD, init: "0" },
    { id: "y", phi: (r,x,z) => _this+(-x*z+r*x-_this)*_timeD, init: "1" },
    { id: "z", phi: (b,x,y) => _this+(-b*_this+x*y)*_timeD, init: "1" },
    { id: "tt", eta: (proj,x,y,z) => map3dto2d([x,y,z],proj) },
    { id: "xx", eta: tt => tt[0] },
    { id: "yy", eta: tt => tt[1] },
  ]
};

_env_data = {
  simDelay: 1,
  trace: 0,
  title: "Lorenz attractor",
  charts: [
    { title: "X,Y projection", top: 100, left: 10, width: 300, height:200,
      series: "[{x:x, y:y}]",
      lines: [{ show: true, color: 'red', width: 0.5 }] },
    { title: "X,Z projection", top: 300, left: 10, width: 300, height:200,
      series: "[{x:x, y:z}]",
      lines: [{ show: false }],
      points: [{show: true, color: 'green', size: 0.5}] },
    { title: "Y,Z projection", top: 500, left: 10, width: 300, height:200,
      series: "[{x:y, y:z}]" },
    { title: "X,Y,Z orbit", top: 200, left: 400, width: 600, height:500,
      series: "[{x:xx, y:yy}]",
      lines: [{ show: true, color: 'blue' }],
      points: [{show: false}] },
  ],
  tables: [
    { title: "time lapse", top: 30, left: 450, height: 120,
      series: "[t1]",
      decimals: [0], alignments: ['center'], lastonly: [true] }
  ],
};
