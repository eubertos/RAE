#!/usr/bin/env node
const fs = require('fs');

function generateReport(data) {
  if (!Array.isArray(data)) {
    throw new Error('Invalid log format: expected an array of timestamps');
  }
  const dates = data
    .map((n) => new Date(Number(n)))
    .filter((d) => !isNaN(d))
    .sort((a, b) => a - b);

  const total = dates.length;
  const last = total ? dates[total - 1] : null;
  const counts = {};
  dates.forEach((d) => {
    const day = d.toISOString().slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  });

  let report = `Total feedback: ${total}\n`;
  report += `Last submission: ${last ? last.toISOString() : 'N/A'}\n`;
  report += 'Daily counts:\n';
  for (const day of Object.keys(counts)) {
    report += `  ${day}: ${counts[day]}\n`;
  }
  return report;
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node feedbackReport.js <feedback.json>');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Failed to read file:', e.message);
    process.exit(1);
  }

  try {
    const report = generateReport(data);
    console.log(report);
    fs.mkdirSync('logs', { recursive: true });
    fs.writeFileSync('logs/feedback_report.txt', report);
    console.log('Report saved to logs/feedback_report.txt');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = { generateReport };
