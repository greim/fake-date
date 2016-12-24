# fake-date

```bash
npm install fake-date
```

Deterministic dates for JavaScript tests.

JavaScript `Date` API is non-deterministic in a couple of ways.

 1. `Date.now()` and `new Date()` varies depending on current time.
 2. Non-UTC input/output varies depending on the host machine's time zone. For example, `new Date(2011, 0, 1)` represents when Jan 1, 2011 started in your time zone, and `someDate.getMonth()` returns the month it was/is/will be for that date in your timezone.

Thus, the same code might have different results on different runs across time and space. That's great sometimes, but bad for unit tests. fake-date replicates the `Date` API, but in a deterministic way, in order to be able to write unit tests that pass or fail consistently.

## How it Works

This module exports a class factory which accepts options and returns a `FakeDate` class which is locked to a specific reference time and timezone offset of your choosing. You can swap in this `FakeDate` class anywhere you'd normally use the global `Date` class.

## API

### Class Factory `fakeDate()`

```js
const fakeDate = require('fake-date');
const FakeDate = fakeDate({

  // An integer representing minutes, reflecting
  // JS's Date#getTimezoneOffset() method
  timezoneOffset: 120, // UTC-02:00

  // Will be used for FakeDate.now()
  // and new FakeDate()
  referenceTime: 0,
});

console.log(new FakeDate().getTimezoneOffset()); // 120
console.log(new FakeDate(2000, 0, 1).toISOString()); // 2000-01-01T02:00:00.000Z
console.log(FakeDate.now()); // 0
setTimeout(() => console.log(FakeDate.now()), 100000); // 0
```

### `FakeDate` Static and Instance Methods

The methods are the same as the `Date` class. See the (MDN docs)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date] for details. The difference is that the concepts of *right now* and *timezone offset* are fixed and controlled by you, rather than being runtime/host-machine-dependent.

## Caveats and Questions

 * Intended for testing, not production.
 * It does not override the global `Date` object for you. You can do that yourself if you want, or better yet, make your date-dependent code accept a date implementation which defaults to the global `Date` object, but passing in a `FakeDate` during tests.
 * Performance will be slightly worse than the native `Date` API.
 * It's timezone-offset-aware, but not timezone-aware. Timezone offset doesn't tell you everything you need to know to determine which timezone you're in. Thus, `toString()` and `toTimeString()` include the time zone offset, but leave off the timezone name, for example `"Sat Jan 01 2000 00:00:00 GMT-0700"` instead of `"Sat Jan 01 2000 00:00:00 GMT-0700 (MST)"`.
 * This module totally punts on `toLocaleString()`, `toLocaleDateString()`, and `toLocaleTimeString()`, which return the exact same values as `toString()`, `toDateString()`, and `toTimeString()`.
