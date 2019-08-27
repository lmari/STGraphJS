_model_data = {
  time0: 0, time1: 7, timeD: 1,
  parameters: [
    { id: "p0", val: 100 },
    { id: "a", val: 100 },
    { id: "b", val: -0.5 },
    { id: "c", val: 50 },
    { id: "d", val: 0.5 },
    { id: "f", val: 0.5 },
  ],
  variables: [
    { id: "domanda", eta: (a,prezzo,b) => a+prezzo*b },
    { id: "domandaPrec", phi: domanda => domanda, init: "a" },
    { id: "offerta", eta: (c,d,prezzoPrec) => c+d*prezzoPrec },
    { id: "diffDomOff", eta: (domandaPrec,offerta) => domandaPrec-offerta },
    { id: "prezzo", out: true, eta: (f,diffDomOff) => f*diffDomOff },
    { id: "prezzoPrec", phi: prezzo => prezzo, init: "p0" },
  ]
};

_env_data = {
  simDelay: 100,
  skipSteps: 3,
  title: "Keynes",
  charts: [
    { title: "chart", top: 100, left: 10, width: 400, height:250,
      xaxis: { min: -0.5, max: 7.5, step: 1 },
      yaxis: { min: -0.5, max: 25.5, step: 2 },
      series: "[prezzo]",
      lines: [{ show: true, color: 'red', width: 1 }],
      points: [{ show: true, color: 'green', size: 10, lastonly: false }] },
  ],
  tables: [
    { title: "table1", top: 350, left: 10, width: "auto", height: 200,
      series: "[Time, prezzo]",
      decimals: [0, 2], alignments: ['center', 'right'], lastonly: [false, false] },
  ],
};
