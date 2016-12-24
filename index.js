'use strict';

module.exports = fakeDate;

function fakeDate({
  referenceTime = 0,
  timezoneOffset = 0,
}) {

  validateTime(referenceTime, 'referenceTime');
  validateTime(timezoneOffset, 'timezoneOffset');

  const nativeTimezoneOffset = new Date().getTimezoneOffset();
  const timezoneCorrection = timezoneOffset - nativeTimezoneOffset;
  const timezoneCorrectionMillis = timezoneCorrection * 60 * 1000;

  class MockDate {

    static now() {
      return referenceTime;
    }

    static UTC(...args) {
      return Date.UTC(...args);
    }

    static parse(dateString) {
      const isISO = isISODate(dateString);
      const hasTimeZone = dateStringHasTimezone(dateString);
      if (isISO || hasTimeZone) {
        return Date.parse(dateString);
      } else {
        return Date.parse(dateString) + timezoneCorrectionMillis;
      }
    }

    constructor(...args) {
      args = correctArgs(args, timezoneCorrectionMillis, referenceTime);
      const date = new Date(...args);
      PRIV.set(this, { date });
    }

    getTimezoneOffset() {
      return timezoneOffset;
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
        const fudge = new Date(date.getTime() - timezoneCorrectionMillis);
        const hour = leftPad(fudge.getHours(), 2);
        const minute = leftPad(fudge.getMinutes(), 2);
        const second = leftPad(fudge.getSeconds(), 2);
        const sign = timezoneOffset < 0 ? '+' : '-';
        const offsetHours = sign + leftPad(Math.floor(Math.abs(timezoneOffset) / 60), 2);
        const offsetMinutes = leftPad(timezoneOffset % 60, 2);
        return `${hour}:${minute}:${second} GMT${offsetHours}${offsetMinutes}`;
      }
    }

    toDateString() {
      // 'Wed Jul 01 1993'
      if (isNaN(this.getTime())) {
        return 'Invalid Date';
      } else {
        const { date } = PRIV.get(this);
        const fudge = new Date(date.getTime() - timezoneCorrectionMillis);
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
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      const fudge = new Date(date.getTime() - timezoneCorrectionMillis);
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
    MockDate.prototype[method] = function(...args) {
      const { date } = PRIV.get(this);
      const fudge = new Date(date.getTime() - timezoneCorrectionMillis);
      fudge[method](...args);
      date.setTime(fudge.getTime() + timezoneCorrectionMillis);
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
  const isoDatePatt = /^\d\d\d\d\-\d\d\-\d\d/;
  return function(dateStr) {
    return isoDatePatt.test(dateStr);
  };
})();

const correctArgs = (() => {
  return function(args, timezoneCorrectionMillis, referenceTime) {
    if (args.length === 0) {
      return [referenceTime];
    } else if (args.length === 1) {
      if (typeof args[0] === 'number') {
        return args;
      } else {
        const isISO = isISODate(args[0]);
        const hasTimeZone = dateStringHasTimezone(args[0]);
        if (isISO || hasTimeZone) {
          return args;
        } else {
          return [Date.parse(args[0]) + timezoneCorrectionMillis];
        }
      }
    } else {
      return [Date.UTC(...args) + timezoneCorrectionMillis];
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
