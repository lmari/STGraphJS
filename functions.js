// Type helpers
function isNumber(x) { return typeof x == "number"; }
function isArray(x) { return Array.isArray(x); }
function isFunction(x) { return typeof x == "function"; }

// Helper for making monadic functions polymorphic
function funHelper1(f,x) {
  if(isNumber(x)) return f(x);
  if(isArray(x)) { return x.map(x1 => f(x1)); }
  return 'funHelper1-e1';
}

// Helper for making dyadic functions polymorphic
function funHelper2(f,x,y) {
  if(isNumber(x) && isNumber(y)) return f(x,y);
  if(isArray(x) && isNumber(y)) { return x.map(x1 => f(x1,y)); }
  if(isNumber(x) && isArray(y)) { return y.map(y1 => f(x,y1)); }
  if(isArray(x) && isArray(y)) {
    if(x.length == y.length) return x.map((x1,i) => f(x1,y[i]));
    if(x.length < y.length) return x.concat(Array(y.length-x.length).fill(0)).map((x1,i) => f(x1,y[i]));
    return y.concat(Array(x.length-y.length).fill(0)).map((y1,i) => f(x[i],y1));
  }
  return 'funHelper2-e1';
}

// Meta-functions for creating polymorphic monadic or dyadic functions
function newFunction1(f) { return x => funHelper1(f,x); }
function newFunction2(f) { return (x,y) => funHelper2(f,x,y); }

// Reduce meta-function
function reduce(f,a) { return a.reduce((x,i) => f(x,i)); }

// Sequence generator
function seq(x,y,z) {
  if(!isNumber(x)) return 'ERR: seq-e1';
  if(y == null) {
    x = parseInt(x);
  	if(x <= 0) return 'ERR: seq-e2';
    return Array.from(Array(x).keys());
  }
  if(!isNumber(y)) return 'ERR: seq-e3';
  if(z == null) {
  	x = parseInt(x);
    y = parseInt(y);
  	if(y <= x) return 'ERR: seq-e4';
    let res = [];
    for(let i=x; i<y; i++) res.push(i);
    return res;
  }
  if(!isNumber(z)) return 'ERR: seq-e5';
  if(z == 0 || x == y) return 'ERR: seq-e6';
  if((z > 0 && x > y) || (z < 0 && x<y)) return 'ERR: seq-e7';
  let res = [];
  if(z > 0) {
    while(x < y) { res.push(x); x+=z; }
    return res;
  }
  while(x > y) { res.push(x); x+=z; }
  return res;
}

// Array generator
function array(x,f) {
  let res = [];
  if(isNumber(f)) for(let i=0; i<x; i++) res.push(f);
  else if(isFunction(f)) for(let i=0; i<x; i++) res.push(f());
  else return 'ERR: array-e1';
  return res;
}

// Some functions...
function abs(x) { return funHelper1(Math.abs,x); }
function sin(x) { return funHelper1(Math.sin,x); }
function cos(x) { return funHelper1(Math.cos,x); }
function int(x) { return funHelper1(parseInt,x); }
function plus(x,y) { return funHelper2((x,y)=>x+y,x,y); }
function minus(x,y) { return funHelper2((x,y)=>x-y,x,y); }
function times(x,y) { return funHelper2((x,y)=>x*y,x,y); }
function divided(x,y) { return funHelper2((x,y)=>x/y,x,y); }
function round(x,y) { return funHelper2((x,y)=>1*x.toFixed(y),x,y); }
function max(x,y) { return funHelper2(Math.max,x,y); }
function min(x,y) { return funHelper2(Math.min,x,y); }

function rand(x,y) {
  if(x == null) return Math.random();
  if(y == null) return x*Math.random();
  return x+(y-x)*Math.random();
}

function sysTime() { return new Date().getTime(); }
