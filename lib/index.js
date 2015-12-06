(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Realloc"] = factory();
	else
		root["Realloc"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createObservableState = __webpack_require__(2);

	var _createObservableState2 = _interopRequireDefault(_createObservableState);

	var _actionCreatorFactory = __webpack_require__(3);

	var _actionCreatorFactory2 = _interopRequireDefault(_actionCreatorFactory);

	var _JSONPathCompiler = __webpack_require__(5);

	var _JSONPathCompiler2 = _interopRequireDefault(_JSONPathCompiler);

	var _utils = __webpack_require__(4);

	exports['default'] = {
	  createObservableState: _createObservableState2['default'],
	  actionCreatorFactory: _actionCreatorFactory2['default'],
	  Compiler: _JSONPathCompiler2['default'],
	  JSONPath: _JSONPathCompiler.JSONPath
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createObservableState;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _actionCreatorFactory = __webpack_require__(3);

	var _actionCreatorFactory2 = _interopRequireDefault(_actionCreatorFactory);

	var _JSONPathCompiler = __webpack_require__(5);

	var _JSONPathCompiler2 = _interopRequireDefault(_JSONPathCompiler);

	function createObservableState() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var currentState = {
	    $: initialState
	  };
	  var subscribers = [];
	  function subscribe(callback) {
	    subscribers = subscribers.concat(callback);
	    return function () {
	      subscribers = subscribers.filter(function (cb) {
	        return cb !== callback;
	      });
	    };
	  }
	  function getState() {
	    return currentState.$;
	  }
	  function createGetter(path) {
	    var compiler = new _JSONPathCompiler2['default'](path);
	    var matcher = compiler.createMatcher();
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return matcher(currentState.$, args).map(function (v) {
	        return v.value;
	      });
	    };
	  }
	  var createAction = _actionCreatorFactory2['default'](function () {
	    return currentState.$;
	  }, function (nextState, results) {
	    var prevState = currentState.$;
	    currentState.$ = nextState;
	    subscribers.forEach(function (cb) {
	      return cb(currentState.$, prevState, results);
	    });
	  });
	  return {
	    getState: getState,
	    createGetter: createGetter,
	    subscribe: subscribe,
	    createAction: createAction
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = actionCreatorFactory;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(4);

	var _JSONPathCompiler = __webpack_require__(5);

	var _JSONPathCompiler2 = _interopRequireDefault(_JSONPathCompiler);

	function actionCreatorFactory(stateGetter, collect) {
	  // const createActions = (...actions) => {
	  //   actions.map((action) => {
	  //     const options = Object.assign({deps:[]}, action.options)
	  //     const compiler = new Compiler(action.keyPath)
	  //     const matcher = compiler.createMatcher()
	  //     return (...payloads) => {
	  //
	  //     }
	  //   })
	  //   return (...payloads) => {
	  //
	  //   }
	  // }
	  // const createAction = (keyPath, callback, options) => createActions({
	  //   keyPath,
	  //   callback,
	  //   options
	  // })
	  // return {
	  //   createAction,
	  //   createActions
	  // }
	  return function (keyPath, fn, opts) {
	    var options = Object.assign({ deps: [] }, opts);
	    var compiler = new _JSONPathCompiler2['default'](keyPath);
	    var matcher = compiler.createMatcher();
	    return function () {
	      for (var _len = arguments.length, payloads = Array(_len), _key = 0; _key < _len; _key++) {
	        payloads[_key] = arguments[_key];
	      }

	      var $ = stateGetter();
	      var value = matcher($, payloads).reduce(function (accValue, result) {
	        var pwd = result.pwd.slice(1);
	        var set = function set(newValue) {
	          if (result.name === null) {
	            return newValue;
	          }
	          var $old = accValue.$;
	          var oldCur = $old;
	          var $new = _utils.clone(accValue.$);
	          var newCur = $new;
	          pwd.forEach(function (key) {
	            if (key !== null) {
	              newCur[key] = _utils.clone(oldCur[key]);
	              newCur = newCur[key];
	              oldCur = oldCur[key];
	            }
	          });
	          newCur[result.name] = newValue;
	          return $new;
	        };
	        var done = function done(newValue) {
	          //TODO async set : check value, do collect
	          stateGetter();
	          set(newValue);
	        };
	        var args = payloads.concat([result.value, done]);
	        var newValue = fn.apply(result, args);
	        if (newValue !== void 0) {
	          return {
	            $: set(newValue),
	            results: accValue.results.concat(result)
	          };
	        } else {
	          return accValue;
	        }
	      }, {
	        $: $,
	        results: []
	      });
	      if (value.$ !== $) {
	        collect(value.$, value.results);
	      }
	      return value;
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	/**
	 *
	 *
	 *
	 */

	'use strict';

	exports.__esModule = true;
	exports.stackProcess = stackProcess;
	var ArrayProto = Array.prototype,
	    ObjProto = Object.prototype,
	    FuncProto = Function.prototype;

	var nativeIsArray = Array.isArray,
	    nativeKeys = Object.keys,
	    nativeBind = FuncProto.bind,
	    nativeCreate = Object.create,
	    hasOwnProperty = ObjProto.hasOwnProperty,
	    toString = ObjProto.toString,
	    push = ArrayProto.push,
	    slice = ArrayProto.slice,
	    nativeAssign = Object.assign;

	var isUndefined = function isUndefined(obj) {
	  return obj === void 0;
	};

	exports.isUndefined = isUndefined;
	var isObject = function isObject(obj) {
	  var type = typeof obj;
	  return type === 'function' || type === 'object' && !!obj;
	};

	exports.isObject = isObject;
	var isPlainObject = function isPlainObject(obj) {
	  if (typeof obj !== 'object') {
	    return false;
	  }
	  if (obj.constructor && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
	    return false;
	  }
	  return true;
	};
	exports.isPlainObject = isPlainObject;
	var isArray = nativeIsArray || function (obj) {
	  return toString.call(obj) === '[object Array]';
	};

	exports.isArray = isArray;
	var isFunction = function isFunction(obj) {
	  return typeof obj == 'function' || false;
	};

	exports.isFunction = isFunction;
	var has = function has(obj, key) {
	  return obj != null && hasOwnProperty.call(obj, key);
	};

	exports.has = has;
	var keys = nativeKeys || function (obj) {
	  var keys = [];
	  for (var key in obj) if (has(obj, key)) keys.push(key);
	  return keys;
	};

	exports.keys = keys;
	var assign = nativeAssign || function (target) {
	  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    sources[_key - 1] = arguments[_key];
	  }

	  sources.forEach(function (source) {
	    keys(source).forEach(function (key) {
	      target[key] = source[key];
	    });
	  });
	  return target;
	};

	exports.assign = assign;
	var clone = function clone(obj) {
	  if (!obj) return obj;
	  if (isArray(obj)) {
	    return obj.slice();
	  } else {
	    return assign({}, obj);
	  }
	};

	exports.clone = clone;
	var range = function range(start, stop, step) {
	  if (stop == null) {
	    stop = start || 0;
	    start = 0;
	  }
	  step = step || 1;

	  var length = Math.max(Math.ceil((stop - start) / step), 0);
	  var range = Array(length);

	  for (var idx = 0; idx < length; idx++, start += step) {
	    range[idx] = start;
	  }
	  return range;
	};

	exports.range = range;

	function stackProcess(expr, fns) {
	  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var head = fns[0],
	      tails = fns.slice(1),
	      preProcessor = head[0],
	      postProcessor = head[1] || function (a) {
	    return a;
	  };

	  var preResult = preProcessor(expr, context);
	  if (!tails.length) {
	    return postProcessor(preResult, context);
	  } else {
	    return postProcessor(stackProcess(preResult, tails, context), context);
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _utils = __webpack_require__(4);

	var _lexers = __webpack_require__(6);

	var _lexers2 = _interopRequireDefault(_lexers);

	function JSONPath(source, expr) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var resultType = (options.resultType || 'value').toUpperCase();
	  var getResult = undefined;
	  if (resultType === 'VALUE') {
	    getResult = function (v) {
	      return v.value;
	    };
	  } else if (resultType === 'PATH') {
	    getResult = function (v) {
	      return v.pwd.concat([v.name]).filter(function (v) {
	        return v !== null;
	      });
	    };
	  }
	  return new Compiler(expr).createMatcher()(source).map(getResult);
	}
	function parseJSONPath(expr) {
	  return _utils.stackProcess(expr, _lexers2['default']);
	}

	var Compiler = (function () {
	  _createClass(Compiler, null, [{
	    key: 'JSONPath',
	    value: JSONPath,
	    enumerable: true
	  }, {
	    key: 'parseJSONPath',
	    value: parseJSONPath,
	    enumerable: true
	  }]);

	  function Compiler(exprs, notNormalized) {
	    _classCallCheck(this, Compiler);

	    if (notNormalized !== false) {
	      exprs = parseJSONPath(exprs);
	    }
	    this.exprArray = exprs.map(function (lex) {
	      return lex.replace(/\{([^\{]*)\}/g, function ($0, $1) {
	        return 'args' + (/^\[\d+\]/.test($1) ? '' : '[0]') + $1 + '';
	      });
	    });
	  }

	  Compiler.prototype.createMatcher = function createMatcher() {
	    var _this = this;

	    var lastIndex = this.exprArray.length - 1;
	    var body = _utils.stackProcess('', this.exprArray.map(function (expr, i) {
	      if (i === 0) {
	        return [function (input, ctx) {
	          return input + 'var matches = [], $0 = $, pwd0 = "$";\n' + (i === lastIndex ? 'matches.push({' + 'pwd: [pwd0], ' + 'name: null, ' + 'value: $0' + '});\n' : '');
	        }, function (input, ctx) {
	          return input + '\nvar newPwd0;\n' + '\nfor(var j = 0; j < matches.length; j ++){\n' + '\nnewPwd0 = [];' + '\nfor(var jj = 0; jj < matches[j].pwd.length; jj ++){\n' + '\nif(matches[j].pwd[jj] !== null){\n' + 'newPwd0.push(matches[j].pwd[jj]);' + '\n}\n' + '\n}\n' + '\nmatches[j].pwd = newPwd0;' + '\n}\n' + 'return matches;';
	        }];
	      } else {
	        return _this._parseExpr(expr, i, i === lastIndex);
	      }
	    }));
	    try {
	      var _ret = (function () {
	        var fn = new Function('isPlainObject', 'isArray', 'hasOwnProperty', 'range', '$', 'args', body);
	        return {
	          v: function matcher($, args) {
	            return fn(_utils.isPlainObject, _utils.isArray, _utils.hasOwnProperty, _utils.range, $, args);
	          }
	        };
	      })();

	      if (typeof _ret === 'object') return _ret.v;
	    } catch (e) {
	      throw new Error(e + '\nfunction matcher($, args){\n' + body + '\n}');
	    }
	  };

	  Compiler.prototype._parseExpr = function _parseExpr(expr, lv, isLast) {
	    if ('..' === expr) {
	      return [function (input, ctx) {
	        return input + '\n((function(){\n' + 'var stop = false;var breakFn = function(){stop = true};\n' + '\nreturn function recurfn' + lv + '(visit, parentCur, pwd, key, isRoot){\n' + 'visit(parentCur, key, pwd, breakFn);\n' + 'var newPwd = key !== null ? pwd.concat(key) : pwd;\n' + '\nif(stop === false && typeof parentCur === "object"){\n' + '\nvar parentCurKeys;\n' + '\nif(isArray(parentCur)){\n' + 'parentCurKeys = range(parentCur.length);' + '\n}else{\n' + 'parentCurKeys = [];' + '\nfor(var k in parentCur){\n' + '\nif(hasOwnProperty.call(parentCur,k)){\n' + 'parentCurKeys.push(k);\n' + '\n}\n' + '\n}\n' + '\n}\n' + '\nfor(var i = 0; i < parentCurKeys.length; i++){\n' + '\nif(stop === false ){\n' + 'recurfn' + lv + '(visit, parentCur[parentCurKeys[i]], newPwd, parentCurKeys[i]);' + '\n}\n' + '}\n' + '}\n' + '}\n' + '}())(function(recur, key, pwd, breakFn){\n' + 'var $' + lv + ' = recur;\n' + '\nif(isPlainObject($' + lv + ')){\n' + (isLast ? '\nvar matchesPwd = [' + _utils.range(0, lv - 1).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '].concat(pwd);\n' + 'matches.push({' + 'pwd: key === null ? matchesPwd.slice(0, matchesPwd.length - 1) : matchesPwd,' + 'name: key === null ? pwd[pwd.length - 1] : key,' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = key;\n');
	      }, function (input, ctx) {
	        return input + '\n}\n' + '\n},$' + (lv - 1) + ', [], null, true))\n';
	      }];
	    } else if ('*' === expr) {
	      return [function (input, ctx) {
	        return input + '\nvar $$' + (lv - 1) + ';\n' + '\nif(isArray($' + (lv - 1) + ')){\n' + '$$' + (lv - 1) + ' = range($' + (lv - 1) + '.length);' + '\n}else{\n' + '$$' + (lv - 1) + ' = [];' + '\nfor(var k' + lv + ' in $' + (lv - 1) + '){\n' + '\nif(hasOwnProperty.call($' + (lv - 1) + ',k' + lv + ')){\n' + '$$' + (lv - 1) + '.push(k' + lv + ');\n' + '\n}\n' + '\n}\n' + '\n}\n' + '\nfor(var i' + lv + ' = 0;i' + lv + ' < $$' + (lv - 1) + '.length;i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[$$' + (lv - 1) + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: i' + lv + ',' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = i' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '\n}\n';
	      }];
	    } else if (/^\d+(,\d+)*$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + '\nvar k' + lv + ' = [' + expr + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = k' + lv + '[i' + lv + '];\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '\n}\n';
	      }];
	    } else if (/^\d+(:\d+){0,2}$/.test(expr)) {
	      return [function (input, ctx) {
	        var indexes = _utils.range.apply(null, expr.split(':').map(function (i) {
	          return parseInt(i);
	        }));
	        return input + '\nvar k' + lv + ' = [' + indexes.join(', ') + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = k' + lv + '[i' + lv + '];\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '\n}\n';
	      }];
	    } else if (/^\?\(.*\)$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + '\nfor(var i' + lv + ' = 0; i' + lv + ' < $' + (lv - 1) + '.length; i' + lv + '++){\n' + 'if(' + expr.substring(1).replace(/@/g, '$' + (lv - 1) + '[i' + lv + ']') + '){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[i' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: i' + lv + ',' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = i' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '\n}\n' + '\n}\n';
	      }];
	    } else if (/^\(.*\)$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + 'var k' + lv + ' = ' + expr.replace(/@/g, '$' + (lv - 1)) + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + ',' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = k' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '';
	      }];
	    } else if (/^\[.*\]$/.test(expr)) {
	      return [function (input, ctx) {
	        var key = expr.substring(1, expr.length - 1);
	        return input + 'var k' + lv + ' = ' + key + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + expr + ';\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '], ' + 'name: k' + lv + ', ' + 'value: $' + lv + '});\n' : '\nif(isPlainObject($' + lv + ')||isArray($' + lv + ')){\n' + 'var pwd' + lv + ' = k' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + (isLast ? '' : '\n}\n') + '';
	      }];
	    } else {
	      throw new Error('unexpected expression: ' + expr + '');
	    }
	  };

	  return Compiler;
	})();

	exports['default'] = Compiler;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = [[function (input, ctx) {
	  // braces
	  var paramExprs = ctx.paramExprs = [];
	  return input.replace(/\{([^\{]*)\}/g, function ($0, $1) {
	    return '#{' + (paramExprs.push($1) - 1) + '}';
	  });
	}, function (input, ctx) {
	  var paramExprs = ctx.paramExprs;

	  return input.map(function (p) {
	    return p.replace(/^#\{(\d+)\}$/, function ($0, $1) {
	      return '[{' + paramExprs[$1].split('.').map(function (i) {
	        return (/^\d+$/.test(i) ? '[' + i + ']' : '["' + i + '"]'
	        );
	      }).join('') + '}]';
	    })
	    //FIXME .replace(/(?=\w+)#\{(\d+)\}(?=\w+)/g,($0, $1) => '"+{' + paramExprs[$1] + '}+"')
	    .replace(/#\{(\d+)\}/g, function ($0, $1) {
	      return '{' + paramExprs[$1].split('.').map(function (i) {
	        return (/^\d+$/.test(i) ? '[' + i + ']' : '["' + i + '"]'
	        );
	      }).join('') + '}';
	    });
	  });
	}], [function (input, ctx) {
	  // predict [(...)],[?(...)]
	  var predictExprs = ctx.predictExprs = [];
	  return input.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) {
	    return ';##' + (predictExprs.push($1) - 1);
	  });
	}, function (input, ctx) {
	  var predictExprs = ctx.predictExprs;

	  return input.map(function (p) {
	    return p.replace(/^##(\d+)$/, function ($0, $1) {
	      return predictExprs[$1];
	    });
	  });
	}], [function (input, ctx) {
	  // dot identifer
	  var identifers = ctx.identifers = [];
	  return input.replace(/(?:\.)([A-Z_$]+[0-9A-Z_$]*)/ig, function ($0, $1) {
	    return ';###' + (identifers.push($1) - 1);
	  });
	}, function (input, ctx) {
	  var identifers = ctx.identifers;

	  return input.map(function (p) {
	    return p.replace(/^###(\d+)$/, function ($0, $1) {
	      return '["' + identifers[$1] + '"]';
	    });
	  });
	}], [function (input, ctx) {
	  return input.replace(/[\.\[]/g, ';');
	}], [function (input, ctx) {
	  return input.replace(/;;;|;;/g, ';..;').replace(/;$|'?\]|'$/g, '');
	}], [function (input, ctx) {
	  return input.split(';');
	}, function (input, ctx) {
	  return input.map(function (p) {
	    return p.replace(/^(\d+)$/, '[$1]');
	  });
	}]];
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map