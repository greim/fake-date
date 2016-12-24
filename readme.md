# Fake Date

Deterministic dates for JavaScript tests.

```bash
npm install fake-date
```

```js
const fakeDate = require('fake-date');

const FakeDate = fakeDate({
  timezoneOffset: 120,
  referenceTime: 1482568821977,
});

console.log(new FakeDate().getTimezoneOffset());
// 120

console.log(new FakeDate(2000, 0, 1).toISOString());
// 2000-01-01T02:00:00.000Z

console.log(FakeDate.now());
// 1482568821977

setTimeout(() => {
  console.log(FakeDate.now());
  // 1482568821977
}, 100000);
```
