const { generateReport } = require('../../scripts/feedbackReport');

describe('generateReport', () => {
  test('produces formatted report', () => {
    const ts1 = Date.parse('2021-01-01T00:00:00Z');
    const ts2 = Date.parse('2021-01-01T12:00:00Z');
    const ts3 = Date.parse('2021-01-02T00:00:00Z');
    const report = generateReport([ts1, ts2, ts3]);
    expect(report).toContain('Total feedback: 3');
    expect(report).toContain('2021-01-01: 2');
    expect(report).toContain('2021-01-02: 1');
  });

  test('throws error for invalid input', () => {
    expect(() => generateReport('bad')).toThrow('Invalid log format');
  });
});
