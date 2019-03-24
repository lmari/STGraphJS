_model_data = {
  time0: 0, time1: 10, timeD: 1,
  parameters: [
    { id: "p0", val: 0 },
    { id: "a", val: 100 },
    { id: "b", val: -0.5 },
    { id: "c", val: 50 },
    { id: "d", val: 0.5 },
    { id: "f", val: 0.5 }],
  variables: [
    { id: "domanda", eta: "(x,y,z) => x+y*z", args: "[a,prezzo,b]" },
    { id: "domandaPrec", phi: "x => x", args: "[domanda]", init: "a" },
    { id: "offerta", eta: "(x,y,z) => x+y*z", args: "[c,d,prezzoPrec]" },
    { id: "diffDomOff", eta: "(x,y) => x-y", args: "[domandaPrec,offerta]" },
    { id: "prezzo", out: true, eta: "(x,y) => x*y", args: "[f,diffDomOff]" },
    { id: "prezzoPrec", phi: "x => x", args: "[prezzo]", init: "p0" }]
};

_env_data = {
  simDelay: 10,
  timed: false, trace: 2,
  title: "Prezzo, domanda, offerta",
  charts: [
    { id: "chart1", ctx: "canvas1", series: "[prezzo]", line: "(true, 'blue', 1)" },
  ],
};
