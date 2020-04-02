/* global _this, getFromWidget */

_model_data = {
  time0: 0, time1: 100, timeD: 1,
  parameters: [
    { id: "pop", val: 1000 },
    { id: "I0", val: 1 },
  ],
  variables: [
    { id: "nRipr", eta: () => getFromWidget('Numero di riproduzione') },
    { id: "tInf", eta: () => getFromWidget("Durata della infezione") },
    { id: "S", phi: (Ioggi) => _this-Ioggi, init: 999 },
    { id: "I", phi: (Ioggi,Roggi) => _this+Ioggi-Roggi, init: "I0" },
    { id: "Ioggi", eta: (pop,nRipr,tInf,I,S) => (nRipr/tInf)*I*S/pop },
    { id: "Roggi", eta: (tInf,I) => I/tInf },
    { id: "R", phi: (Roggi) => _this+Roggi, init: 0 },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: 'Epidemia (modello 2: popolazione finita)',
  charts: [
    { title: "Infetti e risolti", top: 80, left: 10, width: 500,
      xaxis: { min: 0, max: 100, step: 20 },
      yaxis: { min: 0 },
      series: "[{ x: Time, y: I }, { x: Time, y: R }]",
      lines: [{ show: true, color: 'red', width: 1 }, { show: true, color: 'blue', width: 1 }], },
  ],
  tables: [
    { title: 'mortiTot', top: 200, left: 550,
      series: "[S,I,R]",
      decimals: [0,0,0], alignments: ['center','center','center'], lastonly: [true,true,true] },
  ],
  sliders: [
    { title: 'Numero di riproduzione', top: 550, left: 10, width:200, height: 100,
      min: 0, max: 10, step: 0.1, initialValue: 2,
      tooltip: 'Numero di riproduzione' },
    { title: "Durata della infezione", top: 550, left: 210, width:200, height: 100,
      min: 1, max: 50, step: 1, initialValue: 10,
      tooltip: "Durata della infezione" },
  ],
};
