// Post-test script to generate unified report from Playwright JSON results
const { UnifiedReportGenerator } = require('./helpers/UnifiedReportGenerator');
const path = require('path');

const jsonPath = path.join(__dirname, 'test-results', 'json', 'results.json');
const dummyPage = { context: () => ({ browser: () => ({ browserType: () => ({ name: () => 'chromium' }) }) }) };
const generator = new UnifiedReportGenerator(dummyPage);
generator.loadPlaywrightResults(jsonPath);
generator.generateUnifiedReport().then((reportPath) => {
  console.log('Unified report generated at:', reportPath);
});