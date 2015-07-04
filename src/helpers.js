var is = function is(what) {
  var f = function (o) {
    return Object.prototype.toString.call(o) === '[object ' + what + ']';
  };

  f.name = is + what;

  return f;
};

var isObject = is('Object');
var isFunction = is('Function');
var isArray = is('Array');
var isString = is('String');

var getArguments = function getArguments(arguments) {
  return Array.prototype.slice.call(arguments);
};

var extend = function extend() {
  var args = getArguments(arguments);
  var current = args.shift();

  if (isFunction(current)) {
    var newConstructor = args.shift();

    newConstructor.prototype = Object.create(current.prototype);
    newConstructor.prototype.constructor = newConstructor;

    newConstructor.prototype.super = function (f) {
      if (isFunction(current.prototype[f])) {
        return current.prototype[f].bind(this);
      }

      return current.prototype[f];
    };

    return newConstructor;
  }

  function walk(current, updates) {
    var key;

    for (key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (isObject(updates[key])) {
          if (!current.hasOwnProperty(key)) {
            current[key] = {};
          }

          walk(current[key], updates[key]);
        } else {
          current[key] = updates[key];
        }
      }
    }

    return current;
  }

  args.map(function (arg) {
    walk(current, arg);
  });

  return current;
};

var skipKeys = function skipKeys(o, keysToSkip) {
  var result = {};
  var key;

  for (key in o) {
    if (o.hasOwnProperty(key) && keysToSkip.indexOf(key) === -1) {
      result[key] = o[key];
    }
  }

  return result;
};

var map = function map(o, callback, context, doNotModifyInput) {
  var mapObject = isObject(o);
  var result = mapObject ? {} : [];
  var key;
  var i = 0;
  var callbackResult;

  context = context || this;

  for (key in o) {
    if (mapObject && o.hasOwnProperty(key)) {
      callbackResult = callback.call(context, key, o[key], i);

      if (callbackResult) {
        if (!doNotModifyInput) {
          o[key] = callbackResult;
        }

        result[key] = callbackResult;
      }

      i += 1;
    } else {
      callbackResult = callback.call(context, o[key], parseInt(key, 10));

      if (callbackResult) {
        if (!doNotModifyInput) {
          o[key] = callbackResult;
        }

        result[key] = callbackResult;
      }
    }
  }

  return result;
};

map.DO_NOT_MODIFY_INPUT = true;


var getOrDefault = function getOrDefault(object, key, fallback) {
  return object.hasOwnProperty(key) ? object[key] : fallback;
};

var alias = function alias(target) {
  return function () {
    var args = getArguments(arguments);
    var curriedTarget = Function.prototype.bind.apply(target, [null].concat(args));

    return new curriedTarget();
  };
};

var filterOne = function filterOne(o, callback, context) {
  var result;

  context = context || this;

  map(o, function (item, i) {
    if (callback.call(context, item, i)) {
      result = item;
    }
  });

  return result;
};
