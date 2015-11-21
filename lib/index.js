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

	var _actionCreatorFactory = __webpack_require__(5);

	var _actionCreatorFactory2 = _interopRequireDefault(_actionCreatorFactory);

	var _JSONPathCompiler = __webpack_require__(3);

	exports['default'] = {
	  createObservableState: _createObservableState2['default'],
	  actionCreatorFactory: _actionCreatorFactory2['default'],
	  Compiler: _JSONPathCompiler.Compiler,
	  parseJSONPath: _JSONPathCompiler.parseJSONPath
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createObservableState;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _JSONPathCompiler = __webpack_require__(3);

	var _actionCreatorFactory = __webpack_require__(5);

	var _actionCreatorFactory2 = _interopRequireDefault(_actionCreatorFactory);

	function createObservableState() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var currentState = {
	    $: initialState
	  };
	  var subscribers = [];
	  var broadcastMap = {};
	  function subscribe(callback) {
	    subscribers = subscribers.concat(callback);
	    return function () {
	      subscribers = subscribers.filter(function (cb) {
	        return cb !== callback;
	      });
	    };
	  }
	  function getState(path) {
	    if (!path) {
	      return currentState.$;
	    } else {
	      return;
	    }
	  }
	  var triggerFlag = false;
	  var createAction = _actionCreatorFactory2['default'](currentState, broadcastMap, function (nextState) {
	    currentState.$ = nextState;
	    if (triggerFlag === false) {
	      triggerFlag = true;
	      setTimeout(function () {
	        subscribers.forEach(function (cb) {
	          return cb(currentState.$);
	        });
	        triggerFlag = false;
	      }, 1);
	    }
	  });
	  function watch(listenPaths, keyPath, fn, opts) {
	    var parsedListenPaths = listenPaths.map(function (listenPath) {
	      return _JSONPathCompiler.parseJSONPath(listenPath).join('');
	    });
	    var action = createAction(keyPath, fn, opts);
	    parsedListenPaths.forEach(function (parsedListenPath) {
	      if (!broadcastMap[parsedListenPath]) {
	        broadcastMap[parsedListenPath] = [action];
	      } else {
	        broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].concat([action]);
	      }
	    });
	    return function () {
	      parsedListenPaths.forEach(function (parsedListenPath) {
	        broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].filter(function (a) {
	          return a !== action;
	        });
	      });
	    };
	  }
	  return {
	    getState: getState,
	    subscribe: subscribe,
	    createAction: createAction,
	    watch: watch
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.parseJSONPath = parseJSONPath;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _utils = __webpack_require__(4);

	var Compiler = (function () {
	  function Compiler(exprs, notNormalized) {
	    _classCallCheck(this, Compiler);

	    if (notNormalized !== false) {
	      exprs = parseJSONPath(exprs);
	    }
	    this.exprArray = exprs.map(function (lex) {
	      return lex.replace(/\{([^\{]*)\}/g, function ($0, $1) {
	        return 'args' + (/^\[\d+\]/.test($1) ? '' : '[0].') + $1 + '';
	      });
	    });
	  }

	  Compiler.prototype._parseExpr = function _parseExpr(expr, lv, isLast) {
	    if ('..' === expr) {
	      return [function (input, ctx) {
	        // TODO recursive
	        return input + '';
	      }];
	    } else if ('*' === expr) {
	      return [function (input, ctx) {
	        return input + '\nfor(var i' + lv + ' in $' + (lv - 1) + '){\n' + 'if($' + (lv - 1) + '.hasOwnProperty(i' + lv + ')){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[i' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: i' + lv + ',' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = i' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + '\n}\n' + '\n}\n';
	      }];
	    } else if (/^\d+(,\d+)*$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + '\nvar k' + lv + ' = [' + expr + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = k' + lv + '[i' + lv + '];\n');
	      }, function (input, ctx) {
	        return input + '\n}\n';
	      }];
	    } else if (/^\d+(:\d+){0,2}$/.test(expr)) {
	      return [function (input, ctx) {
	        var indexes = _utils.range.apply(null, expr.split(':').map(function (i) {
	          return parseInt(i);
	        }));
	        return input + '\nvar k' + lv + ' = [' + indexes.join(', ') + '];\n' + '\nfor(var i' + lv + ' = 0; i' + lv + ' < k' + lv + '.length; i' + lv + '++){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '[i' + lv + ']];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + '[i' + lv + '],' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = k' + lv + '[i' + lv + '];\n');
	      }, function (input, ctx) {
	        return input + '\n}\n';
	      }];
	    } else if (/^\?\(.*\)$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + '\nfor(var i' + lv + ' = 0; i' + lv + ' < $' + (lv - 1) + '.length; i' + lv + '++){\n' + 'if(' + expr.substring(1).replace(/@/g, '$' + (lv - 1) + '[i' + lv + ']') + '){\n' + 'var $' + lv + ' = $' + (lv - 1) + '[i' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: i' + lv + ',' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = i' + lv + ';\n');
	      }, function (input, ctx) {
	        return input + '\n}\n' + '\n}\n';
	      }];
	    } else if (/^\(.*\)$/.test(expr)) {
	      return [function (input, ctx) {
	        return input + 'var k' + lv + ' = ' + expr.replace(/@/g, '$' + (lv - 1)) + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '];\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '],' + 'name: k' + lv + ',' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = k' + lv + ';\n');
	      }];
	    } else if (/^\[.*\]$/.test(expr)) {
	      return [function (input, ctx) {
	        var key = expr.substring(1, expr.length - 1);
	        return input + 'var k' + lv + ' = ' + key + ';\n' + 'var $' + lv + ' = $' + (lv - 1) + expr + ';\n' + (isLast ? 'matches.push({' + 'pwd: [' + _utils.range(0, lv).map(function (i) {
	          return 'pwd' + i;
	        }).join(', ') + '], ' + 'name: k' + lv + ', ' + 'value: $' + lv + '});\n' : 'var pwd' + lv + ' = k' + lv + ';\n');
	      }];
	    } else {
	      throw new Error('unexpected expression: ' + expr + '');
	    }
	  };

	  Compiler.prototype.createMatcher = function createMatcher() {
	    var _this = this;

	    var lastIndex = this.exprArray.length - 1;
	    var processors = this.exprArray.map(function (expr, i) {
	      if (i === 0) {
	        return [function (input, ctx) {
	          return input + 'var matches = [], $0 = $, pwd0 = "$";\n';
	        }, function (input, ctx) {
	          return input + '\nreturn matches;';
	        }];
	      } else {
	        return _this._parseExpr(expr, i, i === lastIndex);
	      }
	    });
	    // console.log(stackProcess("", processors))
	    return new Function('$', 'args', _utils.stackProcess("", processors));
	  };

	  return Compiler;
	})();

	exports.Compiler = Compiler;
	var lexers = [[function (input, ctx) {
	  // braces
	  var paramExprs = ctx.paramExprs = [];
	  return input.replace(/\{([^\{]*)\}/g, function ($0, $1) {
	    return '#{' + (paramExprs.push($1) - 1) + '}';
	  });
	}, function (input, ctx) {
	  var paramExprs = ctx.paramExprs;

	  return input.map(function (p) {
	    return p.replace(/^#\{(\d+)\}$/, function ($0, $1) {
	      return '[{' + paramExprs[$1] + '}]';
	    })
	    //FIXME .replace(/(?=\w+)#\{(\d+)\}(?=\w+)/g,($0, $1) => '"+{' + paramExprs[$1] + '}+"')
	    .replace(/#\{(\d+)\}/g, function ($0, $1) {
	      return '{' + paramExprs[$1] + '}';
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
	exports.lexers = lexers;

	function parseJSONPath(expr) {
	  return _utils.stackProcess(expr, lexers);
	}

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
	var pairs = function pairs(obj) {
	  var arr = [];
	  for (var k in obj) {
	    if (has(obj, k)) {
	      arr.push([k, obj[k]]);
	    }
	  }
	  return arr;
	};

	exports.pairs = pairs;
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
	exports['default'] = actionCreatorFactory;

	var _utils = __webpack_require__(4);

	var _JSONPathCompiler = __webpack_require__(3);

	function actionCreatorFactory(stateParent, broadcastMap, collect) {
	  return function (keyPath, fn, opts) {
	    var options = Object.assign({ deps: [] }, opts);
	    var parsedKeyPath = _JSONPathCompiler.parseJSONPath(keyPath);
	    var parsedKeyPathStr = parsedKeyPath.join('');
	    var compiler = new _JSONPathCompiler.Compiler(parsedKeyPath, false);
	    var matcher = compiler.createMatcher();
	    var depsGetters = options.deps.map(function (kp) {
	      return new _JSONPathCompiler.Compiler(kp).createMatcher();
	    });
	    var castFns = Object.keys(broadcastMap).filter(function (v) {
	      return parsedKeyPathStr.indexOf(v) === 0;
	    }).map(function (k) {
	      return broadcastMap[k];
	    }).reduce(function (acc, i) {
	      return acc.concat(i);
	    }, []);
	    return function () {
	      for (var _len = arguments.length, payloads = Array(_len), _key = 0; _key < _len; _key++) {
	        payloads[_key] = arguments[_key];
	      }

	      var matchDeps = depsGetters.map(function (get) {
	        return get(stateParent.$, payloads).map(function (r) {
	          return r.value;
	        });
	      });
	      var execResults = matcher(stateParent.$, payloads).map(function (result) {
	        return fn.apply(null, payloads.concat(matchDeps).concat([result.value, function (newValue) {
	          var $ = _utils.clone(stateParent.$),
	              newCur = $,
	              oldCur = stateParent.$,
	              pwd;
	          if (result.pwd[0] === '$') {
	            pwd = result.pwd.slice(1);
	          } else {
	            pwd = result.pwd;
	          }
	          pwd.forEach(function (key) {
	            newCur[key] = _utils.clone(oldCur[key]);
	            newCur = newCur[key];
	            oldCur = oldCur[key];
	          });
	          newCur[result.name] = newValue;
	          collect($);
	        }, result]));
	      });
	      castFns.forEach(function (fn) {
	        return fn.apply(null, []);
	      });
	      return execResults;
	    };
	  };
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map