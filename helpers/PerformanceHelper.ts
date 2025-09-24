import { Page } from '@playwright/test';

/**
 * Performance Helper Class
 * Provides performance testing functionality
 */
export class PerformanceHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get Core Web Vitals metrics
   */
  async getCoreWebVitals(): Promise<{
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    ttfb: number;
  }> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          fcp: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          ttfb: 0
        };

        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            metrics.lcp = entries[entries.length - 1].startTime;
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Time to First Byte
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0] as PerformanceNavigationTiming;
          metrics.ttfb = nav.responseStart - nav.requestStart;
        }

        // Return metrics after a short delay to capture values
        setTimeout(() => {
          resolve(metrics);
        }, 1000);
      });
    });
  }

  /**
   * Get page load metrics
   */
  async getPageLoadMetrics(): Promise<{
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    totalRequests: number;
    totalBytes: number;
  }> {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        totalRequests: resources.length,
        totalBytes: resources.reduce((total, resource) => {
          return total + (resource as any).transferSize || 0;
        }, 0)
      };
    });
  }

  /**
   * Measure element render time
   */
  async measureElementRenderTime(selector: string): Promise<number> {
    const startTime = Date.now();
    await this.page.locator(selector).waitFor({ state: 'visible' });
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Monitor network requests during page load
   */
  async monitorNetworkRequests(): Promise<{
    requestCount: number;
    failedRequests: number;
    largestRequest: { url: string; size: number };
    slowestRequest: { url: string; duration: number };
  }> {
    const requests: any[] = [];
    
    this.page.on('response', (response) => {
      requests.push({
        url: response.url(),
        status: response.status(),
        size: 0, // Would need additional logic to get actual size
        duration: 0 // Would need additional timing logic
      });
    });

    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');

    const failedRequests = requests.filter(req => req.status >= 400).length;
    
    return {
      requestCount: requests.length,
      failedRequests,
      largestRequest: { url: 'N/A', size: 0 }, // Simplified for now
      slowestRequest: { url: 'N/A', duration: 0 } // Simplified for now
    };
  }

  /**
   * Check for performance issues
   */
  async checkPerformanceIssues(): Promise<{
    issues: string[];
    recommendations: string[];
    score: number;
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    const metrics = await this.getCoreWebVitals();
    const pageMetrics = await this.getPageLoadMetrics();
    
    // Check FCP
    if (metrics.fcp > 3000) {
      issues.push('First Contentful Paint is slow (>3s)');
      recommendations.push('Optimize critical rendering path');
    }
    
    // Check LCP
    if (metrics.lcp > 2500) {
      issues.push('Largest Contentful Paint is slow (>2.5s)');
      recommendations.push('Optimize largest content element loading');
    }
    
    // Check page load time
    if (pageMetrics.loadComplete > 5000) {
      issues.push('Page load time is slow (>5s)');
      recommendations.push('Minimize resource loading and optimize assets');
    }
    
    // Check request count
    if (pageMetrics.totalRequests > 100) {
      issues.push('Too many HTTP requests');
      recommendations.push('Combine and minify resources');
    }
    
    const score = Math.max(0, 100 - (issues.length * 20));
    
    return {
      issues,
      recommendations,
      score
    };
  }

  /**
   * Generate performance report
   */
  async generateReport(): Promise<{
    metrics: any;
    pageMetrics: any;
    issues: string[];
    recommendations: string[];
    score: number;
    timestamp: string;
  }> {
    const metrics = await this.getCoreWebVitals();
    const pageMetrics = await this.getPageLoadMetrics();
    const performanceCheck = await this.checkPerformanceIssues();
    
    return {
      metrics,
      pageMetrics,
      issues: performanceCheck.issues,
      recommendations: performanceCheck.recommendations,
      score: performanceCheck.score,
      timestamp: new Date().toISOString()
    };
  }
}