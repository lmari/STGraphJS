'use strict'

class _Utils {

  static logMsg(text, level=0) {
    let x = (level==0) ? '\n*** ': '    '
    console.log(x+text)
  }
  
  /** Handle errors in a standardized way.
   * @param {string} source source of the error
   * @param {string} text text of the error
   * @param {*} err */
  static logErr(source, text, err) {
    console.error('\n*** ERROR')
    console.error(source.length > 0 ? ('*** Source: ' + source) : '')
    console.error(text.length > 0 ? ('*** ' + text) : '')
    throw err
  }
  
  static getFun(lambda) {
    let l = lambda.toString()
    let x = l.search('=>')
    if(x == 1) throw "getFun(): ERROR: the function must be written as a lambda."
    return [l.slice(0,x).trim(), l.slice(x+2).trim()]
  }

  static isNumber(x) { return typeof x == "number" }
  static isArray(x) { return Array.isArray(x) }
  static isFunction(x) { return typeof x == "function" }

  static isNumberStr(x) { return $.isNumeric(x); }
  static isVariableStr(x) { return _SP.isLetter(x.slice(0,1)) && x.slice(-1) != ')' }
  static isFunctionStr(x) { return _SP.isLetter(x.slice(0,1)) && (x.slice(-1) == ')') }
  static isArrayStr(x) { return x.slice(0,1) == '[' }

}
