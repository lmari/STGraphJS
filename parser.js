'use strict';

function Token(type, value) {
	this.type = type;
	this.value = value;
}

class _SP {
	
	static makeFun(arg, tokens) { return eval(`${arg} => ${tokens.map(token => token.value).join('')}`); }

	static isDot(ch) { return ch == '.'; } static isComma(ch) { return ch == ','; }
	static isLeftPar(ch) { return ch == '('; } static isRightPar(ch) { return ch == ')'; }
	static isLeftSqu(ch) { return ch == '['; } static isRightSqu(ch) { return ch == ']'; }
	static isDigit(ch) { return /\d/.test(ch); }
	static isLetter(ch) { return /[a-z]|_/i.test(ch); }
	static isQuote(ch) { return ch == '\'' || ch == '\"'; }
	static isLambda(ch) { return /=>/.test(ch); }
	static is2Operator(ch) { return /<=|==|!=|>=|&&|\|\||\*\*/.test(ch); }
	static isOperator(ch) { return /!|<|>|\+|-|\*|\/|%|\^/.test(ch); }

	static var() { return 'var' }; static isVar(t, p) { return t[p].type == _SP.var(); }
	static num() { return 'num' }; static isNum(t, p) { return t[p].type == _SP.num(); }
	static str() { return 'str' }; static isStr(t, p) { return t[p].type == _SP.str(); }
	static fun() { return 'fun' }; static isFun(t, p) { return t[p].type == _SP.fun(); }
	static ope() { return 'ope' }; static isOpe(t, p) { return t[p].type == _SP.ope(); }
	static lam() { return 'lam' }; static isLam(t, p) { return t[p].type == _SP.lam(); }
	static lpa() { return 'lpa' }; static isLpa(t, p) { return t[p].type == _SP.lpa(); }
	static rpa() { return 'rpa' }; static isRpa(t, p) { return t[p].type == _SP.rpa(); }
	static lsq() { return 'lsq' }; static isLsq(t, p) { return t[p].type == _SP.lsq(); }
	static rsq() { return 'rsq' }; static isRsq(t, p) { return t[p].type == _SP.rsq(); }
	static com() { return 'com' }; static isCom(t, p) { return t[p].type == _SP.com(); }

	static substTablePrefix() { return [
		{from:'+', to:'__pluspre', prec:0},
		{from:'-', to:'__minuspre', prec:0},
		{from:'!', to:'__not', prec:0}
	]; }

	static substTableInfix() { return [
		{from:'**', to:'__power', prec:1},
		{from:'^', to:'__power', prec:1},
		{from:'*', to:'__times', prec:1},
		{from:'/', to:'__divided', prec:1},
		{from:'%', to:'__mod', prec:1},
		{from:'+', to:'__plus', prec:2},
		{from:'-', to:'__minus', prec:2},
		{from:'<', to:'__less', prec:3},
		{from:'<=', to:'__lesseq', prec:3},
		{from:'>=', to:'__greatereq', prec:3},
		{from:'>', to:'__greater', prec:3},
		{from:'==', to:'__equal', prec:4},
		{from:'!=', to:'__noteq', prec:4},
		{from:'&&', to:'__and', prec:5},
		{from:'||', to:'__or', prec:6}
	]; }

	static tokenize(fun) {
		let str = fun;
		str.replace(/\s+/g, "");
		str = str.split("");
		let tokens = [];
		let stringBuffer = [];
		let numberBuffer = [];
	  let nDots = 0;
	  let i = 0;
		let char, char2;
	  while(i < str.length) {
			char = str[i];
			if(char == ' ') {
				i++;	
				continue;
			}
	    if(_SP.isLetter(char)) {
	      while(i < str.length && (_SP.isLetter(char) || _SP.isDigit(char) || _SP.isDot(char))) {
	        stringBuffer.push(char);
	        char = str[++i];
	      }
	      if(_SP.isLeftPar(char)) tokens.push(new Token(_SP.fun(), stringBuffer.join('')));
	      else tokens.push(new Token(_SP.var(), stringBuffer.join('')));
	      stringBuffer = [];
				continue;
	    }
			if(_SP.isDigit(char) || _SP.isDot(char)) {
	      while(i < str.length && (_SP.isDigit(char) || _SP.isDot(char))) {
	        numberBuffer.push(char);
	        if(_SP.isDot(char)) nDots++;
	        char = str[++i];
	      }
	      if(nDots < 2) tokens.push(new Token(_SP.num(), numberBuffer.join('')));
	      else throw "_SP.tokenizer(): ERROR_1";
	      numberBuffer = [];
	      nDots = 0;
				continue;
			}
			if(_SP.isQuote(char)) {
				stringBuffer.push(char);
				char = str[++i];
				while(i < str.length && !_SP.isQuote(char)) {
	        stringBuffer.push(char);
	        char = str[++i];
	      }
				if(_SP.isQuote(char)) {
					stringBuffer.push(char);
	        char = str[++i];
					tokens.push(new Token(_SP.str(), stringBuffer.join('')));
				} else throw "_SP.tokenizer(): ERROR_2";
	      stringBuffer = [];
				continue;
	    }
			if(i < str.length-1) {
				char2 = char + str[i+1];
				if(_SP.isLambda(char2)) { tokens.push(new Token(_SP.lam(), char2)); i += 2; continue; }
				if(_SP.is2Operator(char2)) { tokens.push(new Token(_SP.ope(), char2)); i += 2; continue; }
			}
			if(_SP.isLeftPar(char)) { tokens.push(new Token(_SP.lpa(), char)); i++; continue; }
	    if(_SP.isRightPar(char)) { tokens.push(new Token(_SP.rpa(), char)); i++; continue; }
			if(_SP.isLeftSqu(char)) { tokens.push(new Token(_SP.lsq(), char)); i++; continue; }
			if(_SP.isRightSqu(char)) { tokens.push(new Token(_SP.rsq(), char)); i++; continue; }
	    if(_SP.isComma(char)) { tokens.push(new Token(_SP.com(), char)); i++; continue; }
			if(_SP.isOperator(char)) { tokens.push(new Token(_SP.ope(), char)); i++; continue; }
			throw "_SP.tokenizer(): ERROR_3";
		}
		if(trace>3) _Utils.logMsg('Tokenizer: ' + tokens.map(i => i.value).join(' '), 1);
		return tokens;
	}

	static inRange(t, p) { return (p >= 0) && (p < t.length); }

	static matchPar(t, p, d) { // vector of tokens, index of the parenthesis in the vector, direction of search (-1 or +1)
		let s1 = t[p].type; // start parenthesis
		let s2; // end parenthesis
		switch(t[p].type) {
			case _SP.lpa(): s2 = _SP.rpa(); break;
			case _SP.rpa(): s2 = _SP.lpa(); break;
			case _SP.lsq(): s2 = _SP.rsq(); break;
			case _SP.rsq(): s2 = _SP.lsq(); break;
			default: return null;
		}
		let n = 0; // number of nested parentheses
		let x;
		p += d;
		while(_SP.inRange(t,p)) {
			x = t[p].type;
			if(x == s2) {
				if(n == 0) return p; // found
				n--; // nested paired parenthesis: pop
			} else if(x == s1) n++; // nested same parenthesis: push
			p += d;
		}
		return null;
	}

	static getRightOperand(t, p) { // vector of tokens, index of operator in the vector
		let c = p+1;
		if(!_SP.inRange(t,c)) return null;
		if(_SP.isNum(t,c)) return [c,c]; // number operand
		if(_SP.isVar(t,c)) {
			if(!_SP.inRange(t,c+1) || !_SP.isLsq(t,c+1)) return [c,c]; // (non-array) variable right operand
			if(_SP.isLsq(t,c+1)) { // array variable right operand
				let r = _SP.matchPar(t,c+1,1);
				return r == null ? null : [c,r];
			}
		}
		if(_SP.isFun(t,c)) { // function operand
			let r = _SP.matchPar(t,c+1,1);
			return r == null ? null : [c,r];
		}
		if(_SP.isLpa(t,c)) { // parenthesized operand
			let r = _SP.matchPar(t,c,1);
			return r == null ? null : [c,r];
		}
		if(_SP.isLsq(t,c)) { // array operand
			let r = _SP.matchPar(t,c,1);
			return r == null ? null : [c,r];
		}
		return null;
	}

	static getLeftOperand(t, p) { // vector of tokens, index of operator in the vector
		let c = p-1;
		if(!_SP.inRange(t,c)) return null;
		if(_SP.isNum(t,c)) return [c,c]; // number operand
		if(_SP.isVar(t,c)) return [c,c]; // (non-array) variable operand
		if(_SP.isRsq(t,c)) { // array variable operand
			let l = _SP.matchPar(t,c,-1);
			if(l == null) return null;
			if(!_SP.inRange(t,l-1) || !_SP.isVar(t,l-1)) return [l,c]; // array variable operand
			return [l-1,c]; // slicing array variable operand
		}
		if(_SP.isRpa(t,c)) { // parenthesized operand or function
			let l = _SP.matchPar(t,c,-1);
			if(l == null) return null;
			if(!_SP.inRange(t,l-1) || !_SP.isFun(t,l-1)) return [l,c]; // parenthesized operand
			return [l-1,c]; // function
		}
		return null;
	}

	static fixPrefixOperators(tokens) {
		let t = tokens;
		let n = tokens.length-1;
		let leftOp, rightOp;
		for(let p=n; p>=0; p--) {
			if(t[p].type == _SP.ope()) {
				leftOp = _SP.getLeftOperand(t,p);
				rightOp = _SP.getRightOperand(t,p);
				if(leftOp == null && rightOp != null) { // prefix operator: only need to make it a function
					t[p] = new Token(_SP.fun(), _SP.substTablePrefix().find(entry => entry.from == t[p].value).to);
					t.splice(rightOp[0], 0, new Token(_SP.lpa(), '('));
					t.splice(rightOp[1]+2, 0, new Token(_SP.rpa(), ')'));
				}
			}
		}
		return t;
	}

	static prefixInfixOperator(tokens, p) { // index of operator in the vector of tokens
		let t = tokens;
		let rightOp = _SP.getRightOperand(t,p);
		if(rightOp == null) return null; // postfix operators not allowed
		let leftOp = _SP.getLeftOperand(t,p);
		if(leftOp == null) return null; // prefix operator already fixed
		t.splice(leftOp[0], 0, new Token(_SP.fun(), _SP.substTableInfix().find(entry => entry.from == t[p].value).to));
		t.splice(leftOp[0]+1, 0, new Token(_SP.lpa(), '('));
		t[leftOp[1]+3] = new Token(_SP.com(), ',');
		t.splice(rightOp[1]+3, 0, new Token(_SP.rpa(), ')'));
		return t;
	}

	static findInOperator(t, prec) { return t.findIndex(el => (el.type == _SP.ope()
		&& _SP.substTableInfix().find(entry => el.value == entry.from && entry.prec == prec))); }

	static transform(tokens) {
		let t = _SP.fixPrefixOperators(tokens);
		let p;
		for(let i=1; i<7; i++) while((p = _SP.findInOperator(t, i)) != -1) t = _SP.prefixInfixOperator(t, p);
		if(trace>3) _Utils.logMsg('Transformer: ' + t.map(i => i.value).join(' '), 1);
		return t;
	}

	static fix(lambda) {
		let arg, fun;
		[arg, fun] = _Utils.getFun(lambda);
		let tokens = _SP.tokenize(fun);
		tokens = _SP.transform(tokens);
		return _SP.makeFun(arg, tokens);
	}

}
