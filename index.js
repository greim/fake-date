'use strict';

module.exports = fakeDate;
Object.defineProperty(exports, '__esModule', {value: true});
exports.default = fakeDate;

const _global = global || window;
const _Date = _global.Date;
// using a function as it may varies depending on DST
function nativeOffsetAt(d = _Date.now()) {
  return new _Date(d).getTimezoneOffset();
}


function fakeDate({
  referenceTime = 0,
  timezoneOffset = 0,
}) {

  validateTime(referenceTime, 'referenceTime');
  validateTime(timezoneOffset, 'timezoneOffset');

  function tzOffsetMillisFor(d) {
    if (timezoneOffset === null) {
      return 0;
    }
    return (timezoneOffset - nativeOffsetAt(d)) * 60 * 1000;
  }
  function timezoneFixer(time) {
    return time + tzOffsetMillisFor(time);
  }

  function ts() {
    return referenceTime === null ? _Date.now() : referenceTime;
  }

  class MockDate {

    static now() {
      return ts();
    }

    static UTC(...args) {
      return _Date.UTC(...args);
    }

    static parse(dateString) {
      const isISO = isISODate(dateString);
      const hasTimeZone = dateStringHasTimezone(dateString);
      if (isISO || hasTimeZone) {
        return _Date.parse(dateString);
      } else {
        return timezoneFixer(_Date.parse(dateString));
      }
    }

    constructor(...args) {
      args = correctArgs(args, timezoneFixer, ts());
      const date = new _Date(...args);
      PRIV.set(this, { date });
    }

    getTimezoneOffset() {
      return timezoneOffset === null
        ? nativeOffsetAt(this.valueOf())
        : timezoneOffset;
    }

    toString() {
      if (isNaN(this.getTime())) {
        return 'Invalid Date';
      } else {
        return `${this.toDateString()} ${this.toTimeString()}`;
      }
    }

    toTimeString() {
      // '02:39:07 GMT-0600'
      if (isNaN(this.getTime())) {
        return 'Invalid Date';
      } else {
        const { date } = PRIV.get(this);
        const offset = timezoneOffset === null ? nativeOffsetAt(+date) : timezoneOffset;
        const fudge = new _Date(+date - tzOffsetMillisFor(+date));
        const hour = leftPad(fudge.getHours(), 2);
        const minute = leftPad(fudge.getMinutes(), 2);
        const second = leftPad(fudge.getSeconds(), 2);
        const sign = offset < 0 ? '+' : '-';
        const offsetHours = sign + leftPad(Math.floor(Math.abs(offset) / 60), 2);
        const offsetMinutes = leftPad(offset % 60, 2);
        return `${hour}:${minute}:${second} GMT${offsetHours}${offsetMinutes}`;
      }
    }

    toDateString() {
      // 'Wed Jul 01 1993'
      if (isNaN(this.getTime())) {
        return 'Invalid Date';
      } else {
        const { date } = PRIV.get(this);
        const fudge = new _Date(+date - tzOffsetMillisFor(+date));
        const dayOfWeek = DAYS_OF_WEEK[fudge.getDay()];
        const month = MONTHS_OF_YEAR[fudge.getMonth()];
        const dayOfMonth = leftPad(fudge.getDate(), 2);
        const year = fudge.getFullYear();
        return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
      }
    }

    toLocaleString() {
      return this.toString();
    }

    toLocaleDateString() {
      return this.toDateString();
    }

    toLocaleTimeString() {
      return this.toTimeString();
    }

    [Symbol.toPrimitive](hint) {
      if (hint === 'string' || hint === 'default') {
        return this.toString();
      } else if (hint === 'number') {
        return this.valueOf();
      }
    }
  }

  for (const method of GET_METHODS) {
    // eslint-disable-next-line no-loop-func
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      const fudge = new _Date(+date - tzOffsetMillisFor(+date));
      return fudge[method](...args);
    };
  }

  for (const method of GET_UTC_METHODS) {
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      return date[method](...args);
    };
  }

  for (const method of SET_METHODS) {
    // eslint-disable-next-line no-loop-func
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      const offsetMs = tzOffsetMillisFor(+date);
      const fudge = new _Date(+date - offsetMs);
      fudge[method](...args);
      date.setTime(+fudge + (isNaN(offsetMs) ? tzOffsetMillisFor(+fudge) : offsetMs));
      return date.getTime();
    };
  }

  for (const method of SET_UTC_METHODS) {
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      return date[method](...args);
    };
  }

  for (const method of PASS_THRU_METHODS) {
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      return date[method](...args);
    };
  }

  return MockDate;
}

function validateTime(t, name) {
  if (t === null) {
    return;
  }
  if (typeof t !== 'number') {
    throw new Error(`expected number for ${name} but found ${typeof t}`);
  } else if (!Number.isInteger(t)) {
    throw new Error(`expected integer for ${name} but found ${t}`);
  }
}

const dateStringHasTimezone = (() => {
  const endsWithLettersPatt = /[A-Za-z]\s*$/;
  return function(dateStr) {
    return endsWithLettersPatt.test(dateStr);
  };
})();

const isISODate = (() => {
  const isoDatePatt = /^\d{4}-\d{2}-\d{2}/;
  return function(dateStr) {
    return isoDatePatt.test(dateStr);
  };
})();

const correctArgs = (() => {
  return function(args, tzFixer, timestamp) {
    if (args.length === 0) {
      return [timestamp];
    } else if (args.length === 1) {
      if (typeof args[0] === 'number') {
        return args;
      } else {
        const isISO = isISODate(args[0]);
        const hasTimeZone = dateStringHasTimezone(args[0]);
        if (isISO || hasTimeZone) {
          return args;
        } else {
          return [tzFixer(_Date.parse(args[0]))];
        }
      }
    } else {
      return [tzFixer(_Date.UTC(...args))];
    }
  };
})();

function leftPad(s, n) {
  s = s + '';
  while (s.length < n) {
    s = '0' + s;
  }
  return s;
}

const PRIV = new WeakMap();

const GET_METHODS = Object.freeze([
  'getDate',
  'getDay',
  'getFullYear',
  'getHours',
  'getMilliseconds',
  'getMinutes',
  'getMonth',
  'getSeconds',
  'getYear',
]);

const GET_UTC_METHODS = Object.freeze([
  'getUTCDate',
  'getUTCDay',
  'getUTCFullYear',
  'getUTCHours',
  'getUTCMilliseconds',
  'getUTCMinutes',
  'getUTCMonth',
  'getUTCSeconds',
]);

const SET_METHODS = Object.freeze([
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setYear',
]);

const SET_UTC_METHODS = Object.freeze([
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
]);

const PASS_THRU_METHODS = Object.freeze([
  'getTime',
  'setTime',
  'toISOString',
  'valueOf',
  'toGMTString',
  'toUTCString',
  'toJSON',
]);

const DAYS_OF_WEEK = Object.freeze([
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]);

const MONTHS_OF_YEAR = Object.freeze([
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]);
