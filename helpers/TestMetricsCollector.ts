/**
 * Test Metrics Collector - Enhanced analytics for test execution
 * Demonstrates advanced test intelligence and trending
 */
export class TestMetricsCollector {
  private static metrics: any[] = [];
  private static testRun: {
    startTime: Date;
    endTime?: Date;
    environment: string;
    browser: string;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
  } | null = null;

  /**
   * Start a new test run session
   */
  static startTestRun(environment: string, browser: string): void {
    this.testRun = {
      startTime: new Date(),
      environment,
      browser,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    };
    this.metrics = [];
  }

  /**
   * Record test execution metrics
   */
  static recordTestMetrics(testInfo: any, additionalMetrics?: any): void {
    if (!this.testRun) return;

    const metric = {
      testName: testInfo.title,
      testFile: testInfo.file || 'unknown',
      status: testInfo.status,
      duration: testInfo.duration,
      retry: testInfo.retry || 0,
      timestamp: new Date(),
      browser: this.testRun.browser,
      environment: this.testRun.environment,
      tags: this.extractTags(testInfo.title),
      performance: additionalMetrics?.performance || {},
      accessibility: additionalMetrics?.accessibility || {},
      coverage: additionalMetrics?.coverage || {},
      errors: testInfo.errors || []
    };

    this.metrics.push(metric);
    
    // Update test run counters
    this.testRun.totalTests++;
    switch (testInfo.status) {
      case 'passed': this.testRun.passedTests++; break;
      case 'failed': this.testRun.failedTests++; break;
      case 'skipped': this.testRun.skippedTests++; break;
    }
  }

  /**
   * Extract tags from test title
   */
  private static extractTags(testTitle: string): string[] {
    const tagRegex = /@(\w+)/g;
    const tags: string[] = [];
    let match;
    
    while ((match = tagRegex.exec(testTitle)) !== null) {
      tags.push(match[1]);
    }
    
    return tags;
  }

  /**
   * End test run and generate summary
   */
  static endTestRun(): any {
    if (!this.testRun) return null;

    this.testRun.endTime = new Date();
    const duration = this.testRun.endTime.getTime() - this.testRun.startTime.getTime();

    const summary = {
      ...this.testRun,
      duration,
      successRate: this.testRun.totalTests > 0 ? 
        Math.round((this.testRun.passedTests / this.testRun.totalTests) * 100) : 0,
      avgTestDuration: this.metrics.length > 0 ?
        Math.round(this.metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / this.metrics.length) : 0,
      
      // Tag-based metrics
      tagMetrics: this.calculateTagMetrics(),
      
      // Performance insights
      performanceMetrics: this.calculatePerformanceMetrics(),
      
      // Quality indicators
      qualityMetrics: this.calculateQualityMetrics(),
      
      // Flaky test detection
      flakyTests: this.detectFlakyTests(),
      
      // Detailed test results
      testResults: this.metrics
    };

    return summary;
  }

  /**
   * Calculate metrics by test tags
   */
  private static calculateTagMetrics(): Record<string, any> {
    const tagStats: Record<string, any> = {};
    
    this.metrics.forEach(metric => {
      metric.tags.forEach((tag: string) => {
        if (!tagStats[tag]) {
          tagStats[tag] = { total: 0, passed: 0, failed: 0, avgDuration: 0 };
        }
        
        tagStats[tag].total++;
        if (metric.status === 'passed') tagStats[tag].passed++;
        if (metric.status === 'failed') tagStats[tag].failed++;
      });
    });

    // Calculate averages and success rates
    Object.keys(tagStats).forEach(tag => {
      const tagMetrics = this.metrics.filter(m => m.tags.includes(tag));
      tagStats[tag].avgDuration = Math.round(
        tagMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / tagMetrics.length
      );
      tagStats[tag].successRate = Math.round(
        (tagStats[tag].passed / tagStats[tag].total) * 100
      );
    });

    return tagStats;
  }

  /**
   * Calculate performance metrics
   */
  private static calculatePerformanceMetrics(): any {
    const performanceData = this.metrics
      .filter(m => m.performance && Object.keys(m.performance).length > 0)
      .map(m => m.performance);

    if (performanceData.length === 0) return {};

    const avgScore = performanceData.reduce((sum, p) => sum + (p.score || 0), 0) / performanceData.length;
    const avgFCP = performanceData.reduce((sum, p) => sum + (p.firstContentfulPaint || 0), 0) / performanceData.length;
    const avgLCP = performanceData.reduce((sum, p) => sum + (p.largestContentfulPaint || 0), 0) / performanceData.length;

    return {
      avgPerformanceScore: Math.round(avgScore),
      avgFirstContentfulPaint: Math.round(avgFCP),
      avgLargestContentfulPaint: Math.round(avgLCP),
      testsWithPerformanceData: performanceData.length
    };
  }

  /**
   * Calculate quality metrics
   */
  private static calculateQualityMetrics(): any {
    const accessibilityData = this.metrics
      .filter(m => m.accessibility && Object.keys(m.accessibility).length > 0)
      .map(m => m.accessibility);

    const coverageData = this.metrics
      .filter(m => m.coverage && Object.keys(m.coverage).length > 0)
      .map(m => m.coverage);

    const avgA11yScore = accessibilityData.length > 0 ?
      accessibilityData.reduce((sum, a) => sum + (a.score || 0), 0) / accessibilityData.length : 0;

    const avgCoverage = coverageData.length > 0 ?
      coverageData.reduce((sum, c) => sum + (c.coveragePercent || 0), 0) / coverageData.length : 0;

    return {
      avgAccessibilityScore: Math.round(avgA11yScore),
      avgCodeCoverage: Math.round(avgCoverage),
      totalViolations: accessibilityData.reduce((sum, a) => sum + (a.violationsFound || 0), 0),
      testsWithA11yData: accessibilityData.length,
      testsWithCoverageData: coverageData.length
    };
  }

  /**
   * Detect potentially flaky tests
   */
  private static detectFlakyTests(): Array<{ testName: string; retries: number; inconsistentResults: boolean }> {
    const testRetries: Record<string, number[]> = {};
    const testResults: Record<string, string[]> = {};

    this.metrics.forEach(metric => {
      const testId = `${metric.testFile}:${metric.testName}`;
      
      if (!testRetries[testId]) {
        testRetries[testId] = [];
        testResults[testId] = [];
      }
      
      testRetries[testId].push(metric.retry);
      testResults[testId].push(metric.status);
    });

    return Object.entries(testRetries)
      .filter(([_, retries]) => retries.some(r => r > 0))
      .map(([testId, retries]) => ({
        testName: testId,
        retries: Math.max(...retries),
        inconsistentResults: new Set(testResults[testId]).size > 1
      }));
  }

  /**
   * Export metrics to JSON file
   */
  static async exportMetrics(filePath: string): Promise<void> {
    const fs = require('fs').promises;
    const summary = this.endTestRun();
    
    if (summary) {
      await fs.writeFile(filePath, JSON.stringify(summary, null, 2));
      console.log(`📊 Test metrics exported to: ${filePath}`);
    }
  }

  /**
   * Get current metrics snapshot
   */
  static getMetricsSnapshot(): any {
    return {
      testRun: this.testRun,
      metrics: this.metrics,
      currentStats: {
        totalTests: this.metrics.length,
        passedTests: this.metrics.filter(m => m.status === 'passed').length,
        failedTests: this.metrics.filter(m => m.status === 'failed').length,
        avgDuration: this.metrics.length > 0 ? 
          Math.round(this.metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / this.metrics.length) : 0
      }
    };
  }
}