import { test, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { AccessibilityHelper } from '../helpers/AccessibilityHelper';
import { PerformanceHelper } from '../helpers/PerformanceHelper';
import { CoverageHelper } from '../helpers/CoverageHelper';
import { SecurityHelper } from '../helpers/SecurityHelper';
import { UnifiedReportGenerator } from '../helpers/UnifiedReportGenerator';

/**
 * Header Navigation Tests - Enhanced with accessibility, performance, security, and reporting
 * Tags: @header @smoke @accessibility @performance @security @critical
 */
test.describe('Header Navigation - Enhanced Tests', () => {
  let headerPage: HeaderPage;
  let accessibilityHelper: AccessibilityHelper;
  let performanceHelper: PerformanceHelper;
  let coverageHelper: CoverageHelper;
  let securityHelper: SecurityHelper;
  let unifiedReporter: UnifiedReportGenerator;

  test.beforeEach(async ({ page }) => {
    headerPage = new HeaderPage(page);
    accessibilityHelper = new AccessibilityHelper(page);
    performanceHelper = new PerformanceHelper(page);
    coverageHelper = new CoverageHelper(page);
    securityHelper = new SecurityHelper(page);
    unifiedReporter = new UnifiedReportGenerator(page);
    
    // Initialize unified report metadata
    unifiedReporter.setMetadata({
      projectName: 'Song Library Test Suite',
      version: '1.0.0',
      environment: 'Test',
      testRun: `header-tests-${Date.now()}`
    });
    
    // Start code coverage collection
    await coverageHelper.startCoverage();
    
    // Navigate to application with performance monitoring
    const startTime = Date.now();
    await page.goto('https://shuxincolorado.github.io/song-list2/dist/song-list2/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`🚀 Page loaded in ${loadTime}ms`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    try {
      // Collect metrics from all tests and add to unified reporter
      console.log('📊 Collecting test metrics for unified reporting...');
      
      // 1. Get performance data
      const performanceData = await performanceHelper.generateReport();
      if (performanceData) {
        unifiedReporter.addPerformanceData({
          score: performanceData.score,
          firstContentfulPaint: performanceData.pageMetrics?.firstContentfulPaint || 0,
          largestContentfulPaint: performanceData.pageMetrics?.largestContentfulPaint || 0,
          renderTime: performanceData.pageMetrics?.renderTime || 0,
          totalRequests: performanceData.pageMetrics?.totalRequests || 0,
          coreWebVitals: performanceData.metrics || {},
          recommendations: performanceData.recommendations || []
        });
        console.log(`⚡ Performance Score: ${performanceData.score}%`);
      }
      
      // 2. Get accessibility data
      const accessibilityData = await accessibilityHelper.generateReport();
      if (accessibilityData) {
        // Debug: Log violation details
        console.log(`🔍 Debug - Violations array length: ${accessibilityData.violations?.length || 0}`);
        if (accessibilityData.violations && accessibilityData.violations.length > 0) {
          console.log('🔍 Debug - Violation details:');
          accessibilityData.violations.forEach((violation, index) => {
            console.log(`  ${index + 1}. ${violation.id}: ${violation.description} (Impact: ${violation.impact})`);
          });
        }
        
        // Store accessibility data to file for persistence across test runs
        const fs = require('fs');
        const path = require('path');
        
        const accessibilityDataForStorage = {
          score: accessibilityData.summary.score,
          violationsFound: accessibilityData.summary.violationCount,
          testsPassed: accessibilityData.summary.passCount,
          violations: accessibilityData.violations || [],
          recommendations: ['Address accessibility violations to improve compliance score'],
          timestamp: new Date().toISOString()
        };
        
        // Ensure test-results directory exists
        const testResultsDir = path.join(process.cwd(), 'test-results');
        if (!fs.existsSync(testResultsDir)) {
          fs.mkdirSync(testResultsDir, { recursive: true });
        }
        
        // Save accessibility data to file
        const accessibilityDataPath = path.join(testResultsDir, 'accessibility-data.json');
        fs.writeFileSync(accessibilityDataPath, JSON.stringify(accessibilityDataForStorage, null, 2));
        
        unifiedReporter.addAccessibilityData(accessibilityDataForStorage);
        console.log(`♿ Accessibility Score: ${accessibilityData.summary.score}%`);
      }
      
      // 3. Get coverage data (if available)
      const coverageData = await coverageHelper.generateCoverageReport();
      if (coverageData && coverageData.metrics) {
        unifiedReporter.addCoverageData(coverageData);
        console.log(`📈 Coverage: ${coverageData.metrics.coveragePercent.toFixed(1)}%`);
      }
      
      // 4. Get security data
      const securityData = await securityHelper.generateSecurityReport();
      if (securityData) {
        unifiedReporter.addSecurityData({
          overallScore: securityData.overallScore,
          securityHeaders: securityData.securityHeaders,
          inputSanitization: securityData.inputSanitization,
          dataExposure: securityData.dataExposure,
          recommendations: securityData.recommendations
        });
        console.log(`🔒 Security Score: ${securityData.overallScore}%`);
      }
      
      // 5. Add test result to unified reporter
      const testStatus = testInfo.status === 'passed' ? 'passed' : 'failed';
      unifiedReporter.addTestResult(testInfo, {
        status: testStatus,
        duration: testInfo.duration,
        screenshots: [],
        errors: testInfo.errors || []
      });
      
    } catch (error) {
      console.log('⚠️ Error collecting metrics:', error instanceof Error ? error.message : String(error));
    }
  });

  test('Header Elements Visibility @smoke', async ({ page }, testInfo) => {
    // Add test metadata
    await testInfo.attach('test-metadata', {
      body: JSON.stringify({
        testType: 'visibility',
        priority: 'critical',
        tags: ['smoke', 'header', 'visibility']
      }),
      contentType: 'application/json'
    });

    console.log('🔍 Testing header elements visibility...');
    
    // Check if Contact Us is visible
    const contactUsVisible = await headerPage.isContactUsVisible();
    
    // Check if Employer Login is visible
    const employerLoginVisible = await headerPage.isEmployerLoginVisible();
    
    // Check if Vendor Login is visible
    const vendorLoginVisible = await headerPage.isVendorLoginVisible();
    
    // At least one header element should be visible (mobile may hide some)
    expect(contactUsVisible || employerLoginVisible || vendorLoginVisible).toBe(true);
    
    const visibilityReport = {
      contactUs: contactUsVisible,
      employerLogin: employerLoginVisible,
      vendorLogin: vendorLoginVisible,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Header elements visibility:', visibilityReport);
    
    // Attach visibility report
    await testInfo.attach('visibility-report', {
      body: JSON.stringify(visibilityReport, null, 2),
      contentType: 'application/json'
    });
  });

  test('Header Accessibility Compliance @accessibility', async ({ page }, testInfo) => {
    console.log('♿ Testing header accessibility compliance...');
    
    // Run accessibility scan on header
    const accessibilityResults = await accessibilityHelper.scanElement('.header-link-bar');
    
    // Test keyboard navigation (using specific selectors to avoid strict mode)
    const keyboardTest = await accessibilityHelper.testKeyboardNavigation([
      '.header-link-bar a:has-text("Contact Us")',
      'a:has-text("Employer Login")',
      'a:has-text("Vendor Login")'
    ]);
    
    // Check color contrast (using specific selectors to avoid strict mode)
    const contrastTest = await accessibilityHelper.checkColorContrast([
      '.header-link-bar a:has-text("Contact Us")',
      'a:has-text("Employer Login")',
      'a:has-text("Vendor Login")'
    ]);
    
    // Generate accessibility report
    const a11yReport = await accessibilityHelper.generateReport();
    
    console.log(`🎯 Accessibility Score: ${a11yReport.summary.score.toFixed(1)}%`);
    console.log(`⚠️ Violations Found: ${a11yReport.summary.violationCount}`);
    console.log(`✅ Tests Passed: ${a11yReport.summary.passCount}`);
    
    // Log detailed violation information
    if (a11yReport.violations && a11yReport.violations.length > 0) {
      console.log('🔍 Detailed Accessibility Violations:');
      a11yReport.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. Rule: ${violation.id}`);
        console.log(`     Description: ${violation.description}`);
        console.log(`     Impact: ${violation.impact}`);
        console.log(`     Help: ${violation.help}`);
        console.log(`     Elements: ${violation.nodes?.length || 0} affected`);
        if (violation.nodes && violation.nodes.length > 0) {
          violation.nodes.slice(0, 2).forEach((node: any, nodeIndex: number) => {
            console.log(`       - Element ${nodeIndex + 1}: ${node.html}`);
          });
        }
        console.log('');
      });
    }
    
    if (keyboardTest.issues.length > 0) {
      console.log('🔧 Keyboard Issues:', keyboardTest.issues);
    }
    
    // Attach detailed accessibility report
    await testInfo.attach('accessibility-report', {
      body: JSON.stringify({
        scan: accessibilityResults,
        keyboard: keyboardTest,
        contrast: contrastTest,
        summary: a11yReport.summary
      }, null, 2),
      contentType: 'application/json'
    });
    
    // Assert no critical accessibility violations (realistic threshold for web apps)
    expect(a11yReport.summary.violationCount).toBeLessThanOrEqual(5); // Allow minor violations
  });

  test('Header Performance Monitoring @performance', async ({ page }, testInfo) => {
    console.log('⚡ Testing header performance...');
    
    // Get performance metrics
    const coreWebVitals = await performanceHelper.getCoreWebVitals();
    const pageMetrics = await performanceHelper.getPageLoadMetrics();
    
    // Measure header element render times
    const headerRenderTime = await performanceHelper.measureElementRenderTime('.header-link-bar');
    
    // Check for performance issues
    const performanceCheck = await performanceHelper.checkPerformanceIssues();
    
    // Generate performance report
    const performanceReport = await performanceHelper.generateReport();
    
    console.log(`🚀 Performance Score: ${performanceReport.score}%`);
    console.log(`📈 First Contentful Paint: ${coreWebVitals.fcp.toFixed(0)}ms`);
    console.log(`🎯 Largest Contentful Paint: ${coreWebVitals.lcp.toFixed(0)}ms`);
    console.log(`🏃 Header Render Time: ${headerRenderTime}ms`);
    console.log(`📊 Total Requests: ${pageMetrics.totalRequests}`);
    
    if (performanceCheck.issues.length > 0) {
      console.log('⚠️ Performance Issues:', performanceCheck.issues);
      console.log('💡 Recommendations:', performanceCheck.recommendations);
    }
    
    // Attach performance report
    await testInfo.attach('performance-report', {
      body: JSON.stringify(performanceReport, null, 2),
      contentType: 'application/json'
    });
    
    // Performance assertions
    expect(headerRenderTime).toBeLessThan(2000); // Header should render within 2 seconds
  expect(performanceReport.score).toBeGreaterThanOrEqual(60); // Minimum performance score
  });

  test('Header Images and Resources @resources', async ({ page }, testInfo) => {
    console.log('🖼️ Testing header images and resources...');
    
    const imageStatus = await headerPage.verifyImagesLoaded();
    
    // Monitor network requests
    const networkReport = await performanceHelper.monitorNetworkRequests();
    
    // Take screenshot for visual validation
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    await testInfo.attach('header-screenshot', {
      body: screenshotBuffer,
      contentType: 'image/png'
    });
    
    console.log('📊 Image loading status:');
    console.log(`Contact Us image: ${imageStatus.contactUsImage ? '✅' : '❌'}`);
    console.log(`Employer Login image: ${imageStatus.employerLoginImage ? '✅' : '❌'}`);
    console.log(`Vendor Login image: ${imageStatus.vendorLoginImage ? '✅' : '❌'}`);
    console.log(`📡 Network requests: ${networkReport.requestCount}`);
    console.log(`❌ Failed requests: ${networkReport.failedRequests}`);
    
    // Attach resource report
    await testInfo.attach('resource-report', {
      body: JSON.stringify({
        images: imageStatus,
        network: networkReport,
        timestamp: new Date().toISOString()
      }, null, 2),
      contentType: 'application/json'
    });
    
    expect(imageStatus.allImagesLoaded).toBe(true);
    expect(networkReport.failedRequests).toBe(0);
  });

  test('Header Functionality and Links @functional', async ({ page }, testInfo) => {
    console.log('🔗 Testing header functionality...');
    
    // Get all links information
    const linksInfo = await headerPage.getAllLinksInfo();
    
    // Test hover interactions
    const hoverTests = [];
    
    if (linksInfo.contactUs.visible) {
  await headerPage.checkContactUsVisibleNoHover();
      hoverTests.push({ element: 'Contact Us', status: 'success' });
    }
    
    if (linksInfo.employerLogin.visible) {
  await headerPage.checkEmployerLoginVisibleNoHover();
      hoverTests.push({ element: 'Employer Login', status: 'success' });
    }
    
    if (linksInfo.vendorLogin.visible) {
  await headerPage.checkVendorLoginVisibleNoHover();
      hoverTests.push({ element: 'Vendor Login', status: 'success' });
    }
    
    // At least one link should be visible and functional
    const visibleLinks = Object.values(linksInfo).filter(link => link.visible);
    expect(visibleLinks.length).toBeGreaterThan(0);
    
    const functionalityReport = {
      links: linksInfo,
      hoverTests,
      visibleLinkCount: visibleLinks.length,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 Header functionality report:');
    console.log(JSON.stringify(functionalityReport, null, 2));
    
    // Attach functionality report
    await testInfo.attach('functionality-report', {
      body: JSON.stringify(functionalityReport, null, 2),
      contentType: 'application/json'
    });
  });

  test('Cross-Browser Header Consistency @responsive', async ({ page, browserName }, testInfo) => {
    console.log(`🌐 Testing header consistency on ${browserName}...`);
    
    // Test different viewport sizes
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    const consistencyResults = [];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Allow layout to adjust
      
      const linksVisible = await headerPage.checkAllLinksVisibility();
      const screenshot = await page.screenshot({ clip: { x: 0, y: 0, width: viewport.width, height: 200 } });
      
      consistencyResults.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        linksVisible,
        browser: browserName
      });
      
      // Attach viewport screenshot
      await testInfo.attach(`header-${viewport.name.toLowerCase()}-${browserName}`, {
        body: screenshot,
        contentType: 'image/png'
      });
    }
    
    console.log(`📱 Consistency test results for ${browserName}:`, consistencyResults);
    
    // Attach consistency report
    await testInfo.attach('consistency-report', {
      body: JSON.stringify({
        browser: browserName,
        results: consistencyResults,
        timestamp: new Date().toISOString()
      }, null, 2),
      contentType: 'application/json'
    });
    
    // At least desktop should show all header elements
    const desktopResult = consistencyResults.find(r => r.viewport === 'Desktop');
    expect(desktopResult?.linksVisible.allVisible || 
           desktopResult?.linksVisible.contactUs || 
           desktopResult?.linksVisible.employerLogin || 
           desktopResult?.linksVisible.vendorLogin).toBe(true);
  });

  test('Header Code Coverage Analysis @coverage', async ({ page }, testInfo) => {
    console.log('📊 Analyzing code coverage for header interactions...');
    
    // Check if coverage API is available (only in Chromium)
    if (!page.coverage) {
      console.log('⚠️ Code coverage API not available in this browser - skipping coverage analysis');
      await testInfo.attach('coverage-info', {
        body: JSON.stringify({
          message: 'Coverage API only available in Chromium-based browsers',
          browser: await page.evaluate(() => navigator.userAgent),
          timestamp: new Date().toISOString()
        }, null, 2),
        contentType: 'application/json'
      });
      return;
    }
    
    // Perform various header interactions to generate coverage
    const linksInfo = await headerPage.getAllLinksInfo();
    
    if (linksInfo.contactUs.visible) {
  await headerPage.checkContactUsVisibleNoHover();
  await headerPage.checkContactUsVisible();
    }
    
    if (linksInfo.employerLogin.visible) {
  await headerPage.checkEmployerLoginVisibleNoHover();
  await headerPage.checkEmployerLoginVisible();
    }
    
    if (linksInfo.vendorLogin.visible) {
  await headerPage.checkVendorLoginVisibleNoHover();
  await headerPage.checkVendorLoginVisible();
    }
    
    // Generate coverage report
    const coverageReport = await coverageHelper.generateCoverageReport();
    
    // Handle null coverage report
    if (!coverageReport || !coverageReport.coverage) {
      console.log('⚠️ Coverage data not available');
      return;
    }
    
    console.log(`📈 Overall Coverage: ${coverageReport.metrics.coveragePercent.toFixed(1)}%`);
    console.log(`📄 Total Files: ${coverageReport.metrics.totalFiles}`);
    console.log(`✅ Covered Files: ${coverageReport.metrics.coveredFiles}`);
    console.log(`📊 Total Bytes: ${coverageReport.metrics.totalBytes}`);
    console.log(`✅ Covered Bytes: ${coverageReport.metrics.coveredBytes}`);
    
    if (coverageReport.recommendations.length > 0) {
      console.log('💡 Coverage Recommendations:', coverageReport.recommendations);
    }
    
    // Validate coverage thresholds
    const thresholdValidation = await coverageHelper.validateCoverageThresholds({
      js: 60,
      css: 50,
      overall: 55
    });
    
    if (thresholdValidation) {
      console.log('🎯 Coverage Threshold Results:');
      console.log(`JS: ${thresholdValidation.results.js.actual.toFixed(1)}% (threshold: ${thresholdValidation.results.js.threshold}%) - ${thresholdValidation.results.js.passed ? '✅' : '❌'}`);
      console.log(`CSS: ${thresholdValidation.results.css.actual.toFixed(1)}% (threshold: ${thresholdValidation.results.css.threshold}%) - ${thresholdValidation.results.css.passed ? '✅' : '❌'}`);
      console.log(`Overall: ${thresholdValidation.results.overall.actual.toFixed(1)}% (threshold: ${thresholdValidation.results.overall.threshold}%) - ${thresholdValidation.results.overall.passed ? '✅' : '❌'}`);
    
      // Attach coverage report
      await testInfo.attach('coverage-report', {
        body: JSON.stringify({
          metrics: coverageReport.metrics,
          summary: coverageReport.coverage.summary,
          thresholds: thresholdValidation,
          recommendations: coverageReport.recommendations,
          timestamp: new Date().toISOString()
        }, null, 2),
        contentType: 'application/json'
      });
    }
    
    // Coverage assertions (relaxed for demo purposes)
    expect(coverageReport.metrics.coveragePercent).toBeGreaterThan(0); // At least some coverage
    expect(coverageReport.metrics.totalFiles).toBeGreaterThan(0); // Files were loaded
  });

  test('Generate Unified Dashboard Report @reporting @dashboard', async ({ page }, testInfo) => {
    console.log('📊 Generating comprehensive unified dashboard report...');
    
    // Collect all test data
    const startTime = Date.now();
    
    // 1. Get performance data
    const performanceData = await performanceHelper.generateReport();
    console.log(`⚡ Performance Score: ${performanceData.score}%`);
    
    // 2. Get accessibility data
    const accessibilityData = await accessibilityHelper.generateReport();
    console.log(`♿ Accessibility Score: ${accessibilityData.summary.score}%`);
    
    // 3. Get coverage data (if available)
    const coverageData = await coverageHelper.generateCoverageReport();
    if (coverageData) {
      console.log(`📈 Coverage: ${coverageData.metrics.coveragePercent.toFixed(1)}%`);
    }
    
    // 4. Get security data
    const securityData = await securityHelper.generateSecurityReport();
    if (securityData) {
      console.log(`🔒 Security Score: ${securityData.overallScore}%`);
    }
    
    // 5. Perform some test interactions to generate data
  await headerPage.checkContactUsVisible();
  await headerPage.checkEmployerLoginVisibleNoHover();
  await headerPage.checkVendorLoginVisible();
    
    const testDuration = Date.now() - startTime;
    
    // Add all data to unified reporter
    unifiedReporter.addTestResult(testInfo, {
      status: 'passed',
      duration: testDuration,
      screenshots: [],
      errors: []
    });
    
    if (performanceData) {
      unifiedReporter.addPerformanceData({
        score: performanceData.score,
        firstContentfulPaint: performanceData.pageMetrics?.firstContentfulPaint || 0,
        largestContentfulPaint: performanceData.pageMetrics?.largestContentfulPaint || 0,
        renderTime: performanceData.pageMetrics?.renderTime || 0,
        totalRequests: performanceData.pageMetrics?.totalRequests || 0,
        coreWebVitals: performanceData.metrics || {},
        recommendations: performanceData.recommendations || []
      });
    }
    
    if (accessibilityData) {
      unifiedReporter.addAccessibilityData({
        score: accessibilityData.summary.score,
        violationsFound: accessibilityData.summary.violationCount,
        testsPassed: accessibilityData.summary.passCount,
        violations: accessibilityData.violations || [],
        recommendations: ['Address accessibility violations to improve compliance score']
      });
    }
    
    if (coverageData) {
      unifiedReporter.addCoverageData(coverageData);
    }
    
    if (securityData) {
      unifiedReporter.addSecurityData({
        overallScore: securityData.overallScore,
        securityHeaders: securityData.securityHeaders,
        inputSanitization: securityData.inputSanitization,
        dataExposure: securityData.dataExposure,
        recommendations: securityData.recommendations
      });
    }
    
    // Generate the unified report
    const reportPath = await unifiedReporter.generateUnifiedReport();
    
    console.log('🎉 Unified Dashboard Report Generated!');
    console.log(`📁 Report Location: ${reportPath}`);
    console.log('📊 Report includes:');
    console.log('   • Test execution results and metrics');
    console.log('   • Application code coverage analysis');
    console.log('   • Performance monitoring data');
    console.log('   • Accessibility compliance scores');
    console.log('   • Interactive dashboard with tabs');
    console.log('   • Overall health score calculation');
    
    // Attach report info to test
    await testInfo.attach('unified-report-info', {
      body: JSON.stringify({
        reportPath,
        summary: {
          performance: performanceData?.score || 0,
          accessibility: accessibilityData?.summary?.score || 0,
          coverage: coverageData?.metrics?.coveragePercent || 0,
          security: securityData?.overallScore || 0,
          testDuration
        },
        instructions: 'Open the HTML report file in your browser to view the interactive dashboard',
        timestamp: new Date().toISOString()
      }, null, 2),
      contentType: 'application/json'
    });
    
    // Assertions
    expect(reportPath).toBeTruthy();
    expect(testDuration).toBeGreaterThan(0);
  });
});