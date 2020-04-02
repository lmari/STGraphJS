/* global _this, getFromWidget */

_model_data = {
  time0: 0, time1: 100, timeD: 1,
  parameters: [
    { id: "I0", val: 1 },
  ],
  variables: [
    { id: "kInf", eta: () => getFromWidget('Tasso di infezione') },
    { id: "kRis", eta: () => getFromWidget('Tasso di risoluzione') },
    { id: "I", phi: (Inuovi,Rnuovi) => _this+Inuovi-Rnuovi, init: "I0" },
    { id: "Inuovi", eta: (kInf,I) => kInf*I },
    { id: "Rnuovi", eta: (kRis,I) => kRis*I },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: 'Epidemia (modello 0: popolazione infinita)',
  charts: [
    { title: "Infetti", top: 80, left: 10, width: 500,
      xaxis: { min: 0, max: 100, step: 20 },
      yaxis: { min: 0 },
      series: "[{ x: Time, y: I }]",
      lines: [{ show: true, color: 'red', width: 1 }], },
  ],
  tables: [
    { title: 'Infetti', top: 200, left: 550,
      series: "[I]",
      decimals: [0], alignments: ['center'], lastonly: [true] },
  ],
  sliders: [
    { title: 'Tasso di infezione', top: 550, left: 10, width:200, height: 100,
      min: 0, max: 1, step: 0.01, initialValue: 0.05,
      tooltip: 'Tasso di infezione' },
    { title: 'Tasso di risoluzione', top: 550, left: 210, width:200, height: 100,
      min: 0, max: 1, step: 0.01, initialValue: 0.01,
      tooltip: 'Tasso di risoluzione' },
  ],
};
