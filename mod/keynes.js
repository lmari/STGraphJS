_model_data = {
  time0: 0, time1: 7, timeD: 1,
  parameters: [
    { id: "p0", val: 100 },
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
  timed: true, trace: 0,
  title: "Prezzo, domanda, offerta",
  charts: [
    { title: "chart1", top: 50, left: 10,
      xaxis: { min: -0.5, max: 7.5, step: 1 },
      series: "[prezzo]",
      lines: [{show: true, color: 'red', width: 1}],
      points: [{show: true, color: 'green', size: 5}] },
  ],
  tables: [
    { title: "table1", top: 450, left: 10, series: "[model.Time, prezzo]", decimals: [0, 2], alignments: ['center', 'right'] },
  ],
};
