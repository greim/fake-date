# Fake Date

Deterministic dates for JavaScript tests.

```bash
npm install fake-date
```

```js
const fakeDate = require('fake-date');

const OldDate = global.Date;

global.Date = fakeDate({
  timezoneOffset: 120,
  referenceTime: 1482568821977,
});

console.log(new Date().getTimezoneOffset());
// 120

console.log(new Date(2000, 0, 1).toISOString());
// 2000-01-01T02:00:00.000Z

console.log(Date.now());
// 1482568821977

setTimeout(() => {
  console.log(Date.now());
  // 1482568821977
}, 100000);
```
