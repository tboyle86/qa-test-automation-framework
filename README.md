# QA Test Automation Framework

A comprehensive test automation framework built with Playwright and TypeScript for testing web applications with advanced reporting, accessibility compliance, performance monitoring, and cross-browser compatibility.

## 🚀 Features

### Core Testing Capabilities
- **Cross-Browser Testing**: Chromium, Firefox, Safari, and Mobile browsers
- **Responsive Design Testing**: Desktop, Tablet, and Mobile viewports
- **Accessibility Compliance**: WCAG guidelines validation and scoring
- **Performance Monitoring**: Page load times, Core Web Vitals, and performance scoring
- **PWA Testing**: Service worker functionality, offline capabilities, and manifest validation
- **Code Coverage Analysis**: Application code coverage tracking and reporting
- **Visual Testing**: Screenshot comparison and visual regression detection

### Advanced Reporting
- **Unified HTML Dashboard**: Comprehensive test results with interactive charts and metrics
- **Allure Reports**: Detailed test execution reports with rich visualizations
- **Playwright Reports**: Built-in HTML reports with test traces and screenshots
- **JSON Data Export**: Structured test results for integration with other tools
- **Real-time Metrics**: Performance, accessibility, and coverage scores
- **Security Analysis**: Security compliance scoring and vulnerability detection

### Test Organization
- **Tag-based Testing**: Organized test suites with smoke, regression, accessibility, performance, and PWA tags
- **Parallel Execution**: Multi-browser and multi-device testing in parallel
- **Test Data Management**: Structured test data and configuration management
- **Custom Assertions**: Enhanced assertions for complex validations
- **Page Object Model**: Maintainable and reusable page objects

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd QA-Test
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🏃‍♂️ Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests by Tags
```bash
# Smoke tests only
npm run test:smoke

# Accessibility tests
npm run test:accessibility

# Performance tests
npm run test:performance

# PWA tests
npm run test:pwa

# Cross-browser tests
npm run test:cross-browser
```

### Generate Reports
```bash
# Generate unified dashboard report
npm run report

# Generate Allure report
npm run allure:generate

# Serve Allure report
npm run allure:serve

# Generate complete unified report
npm run full-report
```

## 📊 Available Reports

### 1. Unified HTML Dashboard
- **Location**: `test-results/unified-reports/latest.html`
- **Features**: Interactive charts, test metrics, accessibility scores, performance data
- **Access**: Open directly in browser or use `npm run serve:report`

### 2. Allure Reports
- **Location**: `test-results/allure-report/index.html`
- **Features**: Detailed test execution, trends, categories, and test history
- **Access**: `npm run allure:serve` or `npx allure open test-results/allure-report`

### 3. Playwright Reports
- **Location**: `playwright-report/index.html`
- **Features**: Test traces, screenshots, network logs, and debugging info
- **Access**: `npx playwright show-report`

## 🧪 Test Structure

```
tests/
├── header.spec.ts              # Header navigation tests
├── navigation-header.spec.ts   # Navigation header functionality
└── song-library.spec.ts        # Main application testing

helpers/
├── AccessibilityHelper.ts      # Accessibility testing utilities
├── CoverageHelper.ts          # Code coverage collection
├── PerformanceHelper.ts       # Performance monitoring
├── PWAHelper.ts               # PWA testing utilities
├── TestUtils.ts               # General testing utilities
├── UnifiedReportGenerator.ts  # Report generation
└── VisualTestingHelper.ts     # Visual testing tools

pages/
├── BasePage.ts                # Base page object
├── HeaderPage.ts              # Header page object
├── NavigationHeaderPage.ts    # Navigation header page object
└── SongLibraryPage.ts         # Song library page object
```

## 🏷️ Test Tags

- `@smoke` - Critical functionality tests
- `@regression` - Comprehensive regression tests
- `@accessibility` - Accessibility compliance tests
- `@performance` - Performance monitoring tests
- `@pwa` - Progressive Web App tests
- `@responsive` - Responsive design tests
- `@crud` - Create, Read, Update, Delete operations
- `@coverage` - Code coverage analysis
- `@security` - Security compliance tests

## ⚙️ Configuration

### Playwright Configuration
- **File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Viewports**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Parallel Testing**: Enabled for faster execution
- **Retries**: Configured for flaky test handling

### Test Data Configuration
- **Environment**: Configurable test environment URLs
- **Test Data**: Structured test data in JSON format
- **Credentials**: Secure credential management
- **Timeouts**: Configurable timeouts for different test types

## 📈 Metrics and Scoring

### Accessibility Scoring
- **WCAG Compliance**: Automated WCAG guideline validation
- **Score Range**: 0-100% accessibility compliance
- **Violation Tracking**: Detailed accessibility violation reporting

### Performance Scoring
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Page Load Times**: Comprehensive timing analysis
- **Score Range**: 0-100% performance rating
- **Resource Analysis**: Network and resource optimization insights

### Coverage Analysis
- **Code Coverage**: Application code execution coverage
- **File Coverage**: Per-file coverage analysis
- **Threshold Monitoring**: Coverage threshold validation
- **Coverage Reports**: Detailed coverage breakdown

## 🔧 Advanced Features

### Code Coverage
```bash
# Run tests with coverage
npm run test:coverage

# Generate coverage report
npm run coverage:report
```

### Visual Testing
```bash
# Update visual baselines
npm run test:visual:update

# Run visual regression tests
npm run test:visual
```

### Performance Monitoring
```bash
# Run performance tests
npm run test:performance

# Generate performance report
npm run performance:report
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the test examples in the `tests/` folder

## 🔄 Continuous Integration

This framework is designed to integrate with:
- **GitHub Actions**: Automated testing on pull requests and deployments
- **Jenkins**: Enterprise CI/CD pipeline integration
- **Azure DevOps**: Microsoft ecosystem integration
- **GitLab CI**: GitLab pipeline integration

## 📚 Documentation

Additional documentation available:
- `ENHANCED-TESTING-SUMMARY.md` - Detailed testing strategy
- `APPLICATION-COVERAGE-GUIDE.md` - Code coverage implementation
- `ARCHITECTURE-GUIDE.md` - Framework architecture details
- `CI-CD-TEST-STRATEGY.md` - CI/CD integration guide

---

**Built with ❤️ for Quality Assurance Excellence**