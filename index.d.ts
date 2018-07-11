declare function fakeDate(options: { 
  referenceTime?: number | null
  timezoneOffset?: number | null
}): typeof Date

export = fakeDate
