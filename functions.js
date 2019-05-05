// Type helpers
var isNumber = x => typeof x == "number";
var isArray = x => Array.isArray(x);
var isFunction = x => typeof x == "function";

/** funHelper1 - Helper for making monadic functions polymorphic.
 * @param  {Function} f function to be made polymorphic
 * @param  {any} x argument of the function
 * @return {Function} polymorphic function */
function funHelper1(f,x) {
  if(isNumber(x)) return f(x);
  if(isArray(x)) { return x.map(x1 => f(x1)); }
  throw '[model.js]funHelper1(): ERROR_1.';
}

// Helper for making dyadic functions polymorphic
function funHelper2(f,x,y) {
  if(isNumber(x) && isNumber(y)) return f(x,y);
  if(isArray(x) && isNumber(y)) return x.map(x1 => f(x1,y));
  if(isNumber(x) && isArray(y)) return y.map(y1 => f(x,y1));
  if(isArray(x) && isArray(y)) {
    if(x.length == y.length) return x.map((x1,i) => f(x1,y[i]));
    if(x.length < y.length) return x.concat(Array(y.length-x.length).fill(0)).map((x1,i) => f(x1,y[i]));
    return y.concat(Array(x.length-y.length).fill(0)).map((y1,i) => f(x[i],y1));
  }
  throw '[model.js]funHelper2(): ERROR_1.';
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
function round(x,y) { return funHelper2((x,y)=>1*x.toFixed(y),x,y); }
function max(x,y) { return funHelper2(Math.max,x,y); }
function min(x,y) { return funHelper2(Math.min,x,y); }

function rand(x,y) {
  if(x == null) return Math.random();
  if(y == null) return x*Math.random();
  return x+(y-x)*Math.random();
}

function pi() { return Math.PI; }

function sysTime() { return new Date().getTime(); }

// 2d vector obtained projecting the 3d vector x by means of the angular coefficients in the 2d vector y
function map3dto2d(x,y) { return [x[0]-x[2]*Math.sin(y[0]),x[1]-x[2]*Math.sin(y[1])]; }

// Functions corresponding to prefix operators
function __pluspre(x) { return funHelper1(x=>+x,x); } // +x
function __minuspre(x) { return funHelper1(x=>-x,x); } // -x
function __not(x) { return funHelper1(x=>!x,x); } // !x

// Functions corresponding to infix operators
function __plus(x,y) { return funHelper2((x,y)=>x+y,x,y); } // x+y
function __minus(x,y) { return funHelper2((x,y)=>x-y,x,y); } // x-y
function __times(x,y) { return funHelper2((x,y)=>x*y,x,y); } // x*y
function __divided(x,y) { return funHelper2((x,y)=>x/y,x,y); } // x/y
function __mod(x,y) { return funHelper2((x,y)=>x%y,x,y); } // x%y
function __power(x,y) { return funHelper2((x,y)=>x**y,x,y); } // x**y and x^y
function __less(x,y) { return funHelper2((x,y)=>x<y,x,y); } // x<y
function __lesseq(x,y) { return funHelper2((x,y)=>x<=y,x,y); } // x<y
function __equal(x,y) { return funHelper2((x,y)=>x==y,x,y); } // x==y
function __notequ(x,y) { return funHelper2((x,y)=>x!=y,x,y); } // x!=y
function __greatereq(x,y) { return funHelper2((x,y)=>x>=y,x,y); } // x>=y
function __greater(x,y) { return funHelper2((x,y)=>x>y,x,y); } // x>y
function __and(x,y) { return funHelper2((x,y)=>x&&y,x,y); } // x&&y
function __or(x,y) { return funHelper2((x,y)=>x||y,x,y); } // x||y

function getFromWidget(widget) { return env._inputWidgets[widget].getValue(); }
