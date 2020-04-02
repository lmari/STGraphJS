_model_data = {
  time0: 0, time1: 300, timeD: 1,
  parameters: [
    { id: "popolazione", val: 1 },
    { id: "infettiIniz", val: 0.01 },
  ],
  variables: [
    { id: "tassoInfez", eta: () => getFromWidget('Tasso di infezione') },
    { id: "tassoGuarig", eta: () => getFromWidget('Tasso di guarigione') },
    { id: "tassoMortal", eta: () => getFromWidget('Tasso di mortalità') },
    { id: "infettiAtt", phi: (nuoviInfetti,nuoviGuariti,nuoviMorti) => min(1,_this+nuoviInfetti-nuoviGuariti-nuoviMorti), init: "infettiIniz" },
    { id: "nuoviGuariti", eta: (infettiAtt,tassoGuarig) => infettiAtt*tassoGuarig },
    { id: "nuoviMorti", eta: (infettiAtt,tassoMortal) => infettiAtt*tassoMortal },
    { id: "nuoviInfetti", eta: (infettiAtt,tassoInfez,suscettibili,popolazione) => infettiAtt*tassoInfez*suscettibili/popolazione },
    { id: "infettiTot", phi: (nuoviInfetti) => _this+nuoviInfetti, init: "infettiIniz" },
    { id: "suscettibili", eta: (infettiTot, popolazione) => popolazione-infettiTot },
    { id: "mortiTot", phi: (nuoviMorti) => _this+nuoviMorti, init: 0 },
  ]
};

_env_data = {
  simDelay: 10,
  trace: 0,
  title: 'Epidemia...',
  charts: [
    { title: 'Infetti totali', top: 70, left: 20, width: 500,
      xaxis: { min: 0, max: 300, step: 30 },
      yaxis: { min: 0 },
      series: "[{ x: Time, y: infettiTot }]",
      lines: [{ show: true, color: 'red', width: 1 }], },
    { title: "Infetti attuali", top: 70, left: 520, width: 500,
      xaxis: { min: 0, max: 300, step: 30 },
      yaxis: { min: 0 },
      series: "[{ x: Time, y: infettiAtt }, { x: Time, y: infettiAtt }]",
      lines: [{ show: true, color: 'red', width: 1 }, { show: true, color: 'blue', width: 1 }], },
  ],
  tables: [
    { title: 'mortiTot', top: 550, left: 620,
      series: "[mortiTot]",
      decimals: [3], alignments: ['center'], lastonly: [true] },
  ],
  sliders: [
    { title: 'Tasso di infezione', top: 550, left: 10, height: 100,
      min: 0, max: 1, step: 0.01, initialValue: 0.03,
      tooltip: 'Tasso di infezione' },
    { title: 'Tasso di guarigione', top: 550, left: 210, height: 100,
      min: 0, max: 1, step: 0.01,
      tooltip: 'Tasso di guarigione' },
    { title: 'Tasso di mortalità', top: 550, left: 410, height: 100,
      min: 0, max: 1, step: 0.01,
      tooltip: 'Tasso di mortalità' },
  ],
};
