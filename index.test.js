/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fakeDate = require('.');

describe('fakeDate', () => {
  describe('factory', () => {
    it('is a function', () => {
      assert.strictEqual(typeof fakeDate, 'function');
    });
    it('requires option object', () => {
      assert.throws(() => fakeDate(), /match/);
    });
    it('allows empty option object', () => {
      fakeDate({});
    });
    it('referenceTime must be a number', () => {
      assert.throws(() => fakeDate({ referenceTime: '0' }), /number/);
    });
    it('referenceTime must be an integer', () => {
      assert.throws(() => fakeDate({ referenceTime: 0.1 }), /integer/);
    });
    it('timezoneOffset must be a number', () => {
      assert.throws(() => fakeDate({ timezoneOffset: '0' }), /number/);
    });
    it('timezoneOffset must be an integer', () => {
      assert.throws(() => fakeDate({ timezoneOffset: 0.1 }), /integer/);
    });
  });
  describe('class', () => {
    it('is a function', () => {
      const FakeDate = fakeDate({});
      assert.strictEqual(typeof FakeDate, 'function');
    });
    it('constructs with no args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(); // eslint-disable-line no-new
    });
    it('constructs with one numeric arg', () => {
      const FakeDate = fakeDate({});
      new FakeDate(1); // eslint-disable-line no-new
    });
    it('constructs with one string arg', () => {
      const FakeDate = fakeDate({});
      new FakeDate('2000-01-01'); // eslint-disable-line no-new
    });
    it('constructs with two args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0); // eslint-disable-line no-new
    });
    it('constructs with three args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0, 1); // eslint-disable-line no-new
    });
    it('constructs with four args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0, 1, 0); // eslint-disable-line no-new
    });
    it('constructs with five args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0, 1, 0, 0); // eslint-disable-line no-new
    });
    it('constructs with six args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0, 1, 0, 0, 0); // eslint-disable-line no-new
    });
    it('constructs with seven args', () => {
      const FakeDate = fakeDate({});
      new FakeDate(2001, 0, 1, 0, 0, 0, 0); // eslint-disable-line no-new
    });
  });
  describe('statics', () => {
    describe('now', () => {
      it('returns a number', () => {
        const FakeDate = fakeDate({});
        assert.strictEqual(typeof FakeDate.now(), 'number');
      });
      it('returns an integer', () => {
        const FakeDate = fakeDate({});
        assert.ok(Number.isInteger(FakeDate.now()), 'not integer');
      });
      it('returns same time as provided in factory', () => {
        const FakeDate = fakeDate({ referenceTime: 1000 });
        assert.strictEqual(FakeDate.now(), 1000);
      });
      it('defaults to zero if not provided in factory', () => {
        const FakeDate = fakeDate({});
        assert.strictEqual(FakeDate.now(), 0);
      });
    });
    describe('UTC', () => {
      it('returns a number', () => {
        const FakeDate = fakeDate({});
        assert.strictEqual(typeof FakeDate.UTC(2011, 0), 'number');
      });
      it('returns an integer', () => {
        const FakeDate = fakeDate({});
        assert.ok(Number.isInteger(FakeDate.UTC(2011, 0)), 'not integer');
      });
      it('returns NaN on string input', () => {
        const FakeDate = fakeDate({});
        assert.ok(isNaN(FakeDate.UTC('f')));
      });
      it('correct epoch', () => {
        const FakeDate = fakeDate({});
        const expected = Date.UTC(1970, 0);
        const actual = FakeDate.UTC(1970, 0);
        assert.strictEqual(actual, expected);
      });
      it('correct modern date', () => {
        const FakeDate = fakeDate({});
        const expected = Date.UTC(2016, 6, 5);
        const actual = FakeDate.UTC(2016, 6, 5);
        assert.strictEqual(actual, expected);
      });
      it('requires multiple args', () => {
        const FakeDate = fakeDate({});
        const time = FakeDate.UTC(2016);
        assert.ok(isNaN(time));
      });
    });
    describe('parse', () => {
      it('returns a number', () => {
        const FakeDate = fakeDate({});
        assert.strictEqual(typeof FakeDate.parse('2001-01-01'), 'number');
      });
      it('returns an integer', () => {
        const FakeDate = fakeDate({});
        assert.ok(Number.isInteger(FakeDate.parse('2001-01-01')), 'not integer');
      });
      it('parses ISO', () => {
        const FakeDate = fakeDate({});
        assert.ok(FakeDate.parse('2001-01-01') > 0);
      });
      it('parses 2822', () => {
        const FakeDate = fakeDate({});
        assert.ok(FakeDate.parse('Jan 2, 1970') > 0);
      });
      it('returns NaN for un-parseable string', () => {
        const FakeDate = fakeDate({});
        assert.ok(isNaN(FakeDate.parse('1234567---')));
      });
      it('treats unqualified ISO as UTC', () => {
        const FakeDate = fakeDate({});
        const actual = FakeDate.parse('2001-01-01');
        const expected = Date.UTC(2001, 0, 1);
        assert.strictEqual(actual, expected);
      });
      it('returns local for Jan 1, 1970', () => {
        const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
        const actual = FakeDate.parse('Jan 1, 1970');
        const expected = Date.parse('1970-01-01T00:00:00.000-02:00');
        assert.strictEqual(actual, expected);
      });
      it('returns UTC for Jan 1, 1970 GMT', () => {
        const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
        const actual = FakeDate.parse('Jan 1, 1970 GMT');
        const expected = Date.parse('1970-01-01T00:00:00.000Z');
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('instance', () => {
    describe('getters', () => {
      describe('getDate', () => {
        it('gets date first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getDate();
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
        it('gets date last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getDate();
          const expected = 31;
          assert.strictEqual(actual, expected);
        });
        it('gets feb 29 in leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-02-29T00:00:00.000-02:00').getDate();
          const expected = 29;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getDay', () => {
        it('gets day first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getDay();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets day last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getDay();
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getFullYear', () => {
        it('gets fullYear first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getFullYear();
          const expected = 2012;
          assert.strictEqual(actual, expected);
        });
        it('gets fullYear last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getFullYear();
          const expected = 2012;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getHours', () => {
        it('gets hours first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getHours();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets hours last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getHours();
          const expected = 23;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getMilliseconds', () => {
        it('gets milliseconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getMilliseconds();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets milliseconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getMilliseconds();
          const expected = 999;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getMinutes', () => {
        it('gets minutes first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getMinutes();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets minutes last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getMinutes();
          const expected = 59;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getMonth', () => {
        it('gets month first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getMonth();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets month last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getMonth();
          const expected = 11;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getSeconds', () => {
        it('gets seconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getSeconds();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets seconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getSeconds();
          const expected = 59;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getTime', () => {
        it('gets time first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getTime();
          const expected = Date.parse('2012-01-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('gets time last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getTime();
          const expected = Date.parse('2012-12-31T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCDate', () => {
        it('gets UTCDate first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCDate();
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCDate last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCDate();
          const expected = 31;
          assert.strictEqual(actual, expected);
        });
        it('gets feb 29 in leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-02-29T00:00:00.000Z').getUTCDate();
          const expected = 29;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCDay', () => {
        it('gets UTCDay first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCDay();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCDay last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCDay();
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCFullYear', () => {
        it('gets UTCFullYear first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCFullYear();
          const expected = 2012;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCFullYear last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCFullYear();
          const expected = 2012;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCHours', () => {
        it('gets UTCHours first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCHours();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCHours last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCHours();
          const expected = 23;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCMilliseconds', () => {
        it('gets UTCMilliseconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCMilliseconds();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCMilliseconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCMilliseconds();
          const expected = 999;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCMinutes', () => {
        it('gets UTCMinutes first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCMinutes();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCMinutes last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCMinutes();
          const expected = 59;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCMonth', () => {
        it('gets UTCMonth first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCMonth();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCMonth last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCMonth();
          const expected = 11;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getUTCSeconds', () => {
        it('gets UTCSeconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000Z').getUTCSeconds();
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
        it('gets UTCSeconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999Z').getUTCSeconds();
          const expected = 59;
          assert.strictEqual(actual, expected);
        });
      });
      describe('getYear', () => {
        it('gets year first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-01-01T00:00:00.000-02:00').getYear();
          const expected = 112;
          assert.strictEqual(actual, expected);
        });
        it('gets year last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2012-12-31T23:59:59.999-02:00').getYear();
          const expected = 112;
          assert.strictEqual(actual, expected);
        });
      });
      describe('valueOf', () => {
        it('gets valueOf first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2016-01-01T00:00:00.000Z').valueOf();
          const expected = new Date('2016-01-01T00:00:00.000Z').valueOf();
          assert.strictEqual(actual, expected);
        });
        it('gets valueOf last milli of year', () => {
        });
      });
      describe('toGMTString', () => {
        it('gets toGMTString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2016-01-01T00:00:00.000Z').toGMTString();
          const expected = new Date('2016-01-01T00:00:00.000Z').toGMTString();
          assert.strictEqual(actual, expected);
        });
        it('gets toGMTString last milli of year', () => {
        });
      });
      describe('toUTCString', () => {
        it('gets toUTCString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2016-01-01T00:00:00.000Z').toUTCString();
          const expected = new Date('2016-01-01T00:00:00.000Z').toUTCString();
          assert.strictEqual(actual, expected);
        });
        it('gets toUTCString last milli of year', () => {
        });
      });
      describe('toJSON', () => {
        it('gets toJSON first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2016-01-01T00:00:00.000Z').toJSON();
          const expected = new Date('2016-01-01T00:00:00.000Z').toJSON();
          assert.strictEqual(actual, expected);
        });
        it('gets toJSON last milli of year', () => {
        });
      });
      describe('toString', () => {
        it('gets string first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toString();
          const expected = 'Sat Jan 01 2000 00:00:00 GMT-0200';
          assert.strictEqual(actual, expected);
        });
        it('gets string last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toString();
          const expected = 'Sun Dec 31 2000 23:59:59 GMT-0200';
          assert.strictEqual(actual, expected);
        });
      });
      describe('toDateString', () => {
        it('gets dateString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toDateString();
          const expected = 'Sat Jan 01 2000';
          assert.strictEqual(actual, expected);
        });
        it('gets dateString last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toDateString();
          const expected = 'Sun Dec 31 2000';
          assert.strictEqual(actual, expected);
        });
      });
      describe('toTimeString', () => {
        it('gets timeString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toTimeString();
          const expected = '00:00:00 GMT-0200';
          assert.strictEqual(actual, expected);
        });
        it('gets timeString last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toTimeString();
          const expected = '23:59:59 GMT-0200';
          assert.strictEqual(actual, expected);
        });
      });
      describe('toLocaleString', () => {
        it('gets localeString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toLocaleString();
          const expected = 'Sat Jan 01 2000 00:00:00 GMT-0200';
          assert.strictEqual(actual, expected);
        });
        it('gets localeString last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toLocaleString();
          const expected = 'Sun Dec 31 2000 23:59:59 GMT-0200';
          assert.strictEqual(actual, expected);
        });
      });
      describe('toLocaleDateString', () => {
        it('gets localeDateString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toLocaleDateString();
          const expected = 'Sat Jan 01 2000';
          assert.strictEqual(actual, expected);
        });
        it('gets localeDateString last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toLocaleDateString();
          const expected = 'Sun Dec 31 2000';
          assert.strictEqual(actual, expected);
        });
      });
      describe('toLocaleTimeString', () => {
        it('gets localeTimeString first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-01-01T00:00:00.000-02:00').toLocaleTimeString();
          const expected = '00:00:00 GMT-0200';
          assert.strictEqual(actual, expected);
        });
        it('gets localeTimeString last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const actual = new FakeDate('2000-12-31T23:59:59.999-02:00').toLocaleTimeString();
          const expected = '23:59:59 GMT-0200';
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('setters', () => {
      describe('setDate', () => {
        it('sets date first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setDate(0);
          const expected = Date.parse('1997-12-31T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets date mid year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-06-15T00:00:00.000-02:00');
          const actual = fd.setDate(16);
          const expected = Date.parse('1998-06-16T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets date last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setDate(32);
          const expected = Date.parse('1999-01-01T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets feb 29 in leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('2000-02-01T00:00:00.000-02:00');
          fd.setDate(29);
          assert.strictEqual(fd.getDate(), 29);
        });
        it('does not set feb 29 in non-leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('2001-02-01T00:00:00.000-02:00');
          fd.setDate(29);
          assert.strictEqual(fd.getDate(), 1);
        });
      });
      describe('setFullYear', () => {
        it('sets fullYear first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setFullYear(1997);
          const expected = Date.parse('1997-01-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets fullYear last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setFullYear(1999);
          const expected = Date.parse('1999-12-31T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets fullYear with month', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setFullYear(1999, 3);
          const expected = Date.parse('1999-04-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets fullYear with month, day', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setFullYear(1999, 1, 8);
          const expected = Date.parse('1999-02-08T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setHours', () => {
        it('sets hours first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setHours(-1);
          const expected = Date.parse('1997-12-31T23:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets hours last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setHours(24);
          const expected = Date.parse('1999-01-01T00:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setMilliseconds', () => {
        it('sets milliseconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setMilliseconds(-1);
          const expected = Date.parse('1997-12-31T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets milliseconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setMilliseconds(1000);
          const expected = Date.parse('1999-01-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setMinutes', () => {
        it('sets minutes first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setMinutes(-1);
          const expected = Date.parse('1997-12-31T23:59:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets minutes last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setMinutes(60);
          const expected = Date.parse('1999-01-01T00:00:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setMonth', () => {
        it('sets month first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setMonth(-1);
          const expected = Date.parse('1997-12-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets month into DST', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setMonth(5);
          const expected = Date.parse('1998-06-01T00:00:00.000-01:00');
          assert.strictEqual(actual, expected);
        });
        it('sets month last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setMonth(12);
          const expected = Date.parse('1999-01-31T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setSeconds', () => {
        it('sets seconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setSeconds(-1);
          const expected = Date.parse('1997-12-31T23:59:59.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets seconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setSeconds(60);
          const expected = Date.parse('1999-01-01T00:00:00.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setYear', () => {
        it('sets year first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000-02:00');
          const actual = fd.setYear(97);
          const expected = Date.parse('1997-01-01T00:00:00.000-02:00');
          assert.strictEqual(actual, expected);
        });
        it('sets year last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999-02:00');
          const actual = fd.setYear(99);
          const expected = Date.parse('1999-12-31T23:59:59.999-02:00');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCDate', () => {
        it('sets UTC date first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCDate(0);
          const expected = Date.parse('1997-12-31T00:00:00.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC date last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCDate(32);
          const expected = Date.parse('1999-01-01T23:59:59.999Z');
          assert.strictEqual(actual, expected);
        });
        it('sets feb 29 in leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('2000-02-01T00:00:00.000Z');
          fd.setUTCDate(29);
          assert.strictEqual(fd.getUTCDate(), 29);
        });
        it('does not set feb 29 in non-leap year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('2001-02-01T00:00:00.000Z');
          fd.setUTCDate(29);
          assert.strictEqual(fd.getUTCDate(), 1);
        });
      });
      describe('setUTCFullYear', () => {
        it('sets UTC fullYear first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCFullYear(1997);
          const expected = Date.parse('1997-01-01T00:00:00.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC fullYear last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCFullYear(1999);
          const expected = Date.parse('1999-12-31T23:59:59.999Z');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCHours', () => {
        it('sets UTC hours first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCHours(-1);
          const expected = Date.parse('1997-12-31T23:00:00.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC hours last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCHours(24);
          const expected = Date.parse('1999-01-01T00:59:59.999Z');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCMilliseconds', () => {
        it('sets UTC milliseconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCMilliseconds(-1);
          const expected = Date.parse('1997-12-31T23:59:59.999Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC milliseconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCMilliseconds(1000);
          const expected = Date.parse('1999-01-01T00:00:00.000Z');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCMinutes', () => {
        it('sets UTC minutes first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCMinutes(-1);
          const expected = Date.parse('1997-12-31T23:59:00.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC minutes last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCMinutes(60);
          const expected = Date.parse('1999-01-01T00:00:59.999Z');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCMonth', () => {
        it('sets UTC month first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCMonth(-1);
          const expected = Date.parse('1997-12-01T00:00:00.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC month last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCMonth(12);
          const expected = Date.parse('1999-01-31T23:59:59.999Z');
          assert.strictEqual(actual, expected);
        });
      });
      describe('setUTCSeconds', () => {
        it('sets UTC seconds first milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-01-01T00:00:00.000Z');
          const actual = fd.setUTCSeconds(-1);
          const expected = Date.parse('1997-12-31T23:59:59.000Z');
          assert.strictEqual(actual, expected);
        });
        it('sets UTC seconds last milli of year', () => {
          const FakeDate = fakeDate({ timezoneOffset: 60 * 2 });
          const fd = new FakeDate('1998-12-31T23:59:59.999Z');
          const actual = fd.setUTCSeconds(60);
          const expected = Date.parse('1999-01-01T00:00:00.999Z');
          assert.strictEqual(actual, expected);
        });
      });
    });
  });
});