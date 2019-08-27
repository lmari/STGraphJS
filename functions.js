/* eslint-disable no-unused-vars */
/* global _Utils, env */
'use strict'

// Type helpers
var isNumber = x => typeof x == 'number';
var isArray = x => Array.isArray(x);
var isFunction = x => typeof x == 'function';
var isObject = x => typeof x == 'object';

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

// Map higher-order function
function map(f,a) { return a.map(x => f(x)); }

// Reduce higher-order function
function reduce(f,a) { return a.reduce((x,i) => f(x,i)); }

// Scan higher-order function
function scan(f,a) { return a.map((v,i,b) => b.slice(0,i+1).reduce(f)); }

// Pairscan higher-order function
function pairscan(f,a) { return a.map((v,i,b) => i==0 ? b[0] : f(b[i-1],b[i])); }


// Sequence generator
function seq(x,y,z) {
  if(!isNumber(x)) _Utils.logErr('[functions.js]seq()', `argument '${x}' must be a number`, new Error('Syntax error'));
  if(y == null) {
    x = Math.round(x);
    if(x <= 0) _Utils.logErr('[functions.js]seq()', `argument '${x}' must be greater than zero`, new Error('Syntax error'));
    return Array.from(Array(x).keys());
  }
  if(!isNumber(y)) _Utils.logErr('[functions.js]seq()', `argument '${y}' must be a number`, new Error('Syntax error'));
  if(z == null) {
    x = Math.round(x);
    y = Math.round(y);
    if(y <= x) throw _Utils.logErr('[functions.js]seq()', `argument '${y}' must be greater than argument '${x}'`, new Error('Syntax error'));
    let res = [];
    for(let i=x; i<y; i++) res.push(i);
    return res;
  }
  if(!isNumber(z)) _Utils.logErr('[functions.js]seq()', `argument '${z}' must be a number`, new Error('Syntax error'));
  if(z == 0) _Utils.logErr('[functions.js]seq()', `argument '${z}' cannot be zero`, new Error('Syntax error'));
  if(z > 0 && x > y) _Utils.logErr('[functions.js]seq()', `argument '${z}' must be negative`, new Error('Syntax error'));
  if(z < 0 && x<y) _Utils.logErr('[functions.js]seq()', `argument '${z}' must be positive`, new Error('Syntax error'));
  let res = [];
  if(z > 0) {
    while(x < y) { res.push(x); x+=z; }
    return res;
  }
  while(x > y) { res.push(x); x+=z; }
  return res;
}

// Array generator
//uses:
// array(num, num): array(5, 0)
// array(num, fun): array(5, () => rand()) or array(5, i => 2*i)
function array(x,f) {
  if(!isNumber(x)) _Utils.logErr('[functions.js]array()', `argument '${x}' must be a number`, new Error('Syntax error'));
  x = Math.round(x);
  if(x <= 0) _Utils.logErr('[functions.js]array()', `argument '${x}' must be greater than zero`, new Error('Syntax error'));
  let res = [];
  if(isNumber(f) || isObject(f)) for(let i=0; i<x; i++) res.push(f);
  else if(isFunction(f)) res = seq(x).map(f);
  else _Utils.logErr('[functions.js]array()', `argument '${f}' must be either a number or a function`, new Error('Syntax error'));
  return res;
}

// Some functions...
function abs(x) { return funHelper1(Math.abs,x); }
function sin(x) { return funHelper1(Math.sin,x); }
function cos(x) { return funHelper1(Math.cos,x); }
function int(x) { return funHelper1(Math.round,x); }
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

function conc(...x) { // x#y
  let res = [];
  x.forEach(i => res = res.concat(isNumber(i) ? [i] : i));
  return res;
}

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
