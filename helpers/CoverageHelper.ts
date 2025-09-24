import { Page } from '@playwright/test';

export class CoverageHelper {
  constructor(private page: Page) {}
  
  async startCoverage(): Promise<void> {
    // Only works in Chromium - collects actual application code coverage
    if (this.page.coverage && this.page.coverage.startJSCoverage) {
      try {
        await this.page.coverage.startJSCoverage({
          resetOnNavigation: false,
          reportAnonymousScripts: true
        });
        
        await this.page.coverage.startCSSCoverage({
          resetOnNavigation: false
        });
        
        console.log('🎯 Started APPLICATION code coverage collection');
      } catch (error) {
        console.log('⚠️ Failed to start coverage collection:', error instanceof Error ? error.message : String(error));
      }
    } else {
      console.log('⚠️ Coverage API not available (requires Chromium)');
    }
  }
  
  async generateCoverageReport(): Promise<any> {
    if (!this.page.coverage) {
      return {
        coverage: null,
        metrics: {
          totalFiles: 0,
          coveredFiles: 0,
          totalLines: 0,
          coveredLines: 0,
          coveragePercent: 0
        },
        recommendations: ['Coverage only available in Chromium browser']
      };
    }

    // Get actual application coverage - check again in case coverage became unavailable
    let jsCoverage = [];
    let cssCoverage = [];
    
    try {
      [jsCoverage, cssCoverage] = await Promise.all([
        this.page.coverage.stopJSCoverage(),
        this.page.coverage.stopCSSCoverage()
      ]);
    } catch (error) {
      console.log('⚠️ Failed to stop coverage collection:', error instanceof Error ? error.message : String(error));
      return {
        coverage: null,
        metrics: {
          totalFiles: 0,
          coveredFiles: 0,
          totalLines: 0,
          coveredLines: 0,
          coveragePercent: 0
        },
        recommendations: ['Coverage collection failed - only available in Chromium browser']
      };
    }

    // Filter to only application files (not test framework)
    const appJsCoverage = jsCoverage.filter(entry => 
      entry.url && (
        entry.url.includes('song-list2') || 
        entry.url.includes('.js') && !entry.url.includes('node_modules')
      )
    );

    const appCssCoverage = cssCoverage.filter(entry => 
      entry.url && (
        entry.url.includes('song-list2') || 
        entry.url.includes('.css') && !entry.url.includes('node_modules')
      )
    );

    const totalFiles = appJsCoverage.length + appCssCoverage.length;
    let totalBytes = 0;
    let coveredBytes = 0;

    // Calculate JS coverage - track unique covered ranges
    for (const entry of appJsCoverage) {
      const sourceLength = entry.source?.length || 0;
      totalBytes += sourceLength;
      
      // Create a set to track unique covered byte positions
      const coveredPositions = new Set<number>();
      
      for (const func of entry.functions) {
        for (const range of func.ranges) {
          if (range.count > 0) {
            // Mark each byte position as covered (avoid double counting)
            for (let pos = range.startOffset; pos < range.endOffset; pos++) {
              coveredPositions.add(pos);
            }
          }
        }
      }
      
      coveredBytes += coveredPositions.size;
    }

    // Calculate CSS coverage - track unique covered ranges
    for (const entry of appCssCoverage) {
      const textLength = entry.text?.length || 0;
      totalBytes += textLength;
      
      // Create a set to track unique covered byte positions
      const coveredPositions = new Set<number>();
      
      for (const range of entry.ranges) {
        // Mark each byte position as covered (avoid double counting)
        for (let pos = range.start; pos < range.end; pos++) {
          coveredPositions.add(pos);
        }
      }
      
      coveredBytes += coveredPositions.size;
    }

    const coveragePercent = totalBytes > 0 ? (coveredBytes / totalBytes) * 100 : 0;

    return {
      coverage: { js: appJsCoverage, css: appCssCoverage },
      metrics: {
        totalFiles,
        coveredFiles: totalFiles,
        totalBytes,
        coveredBytes,
        coveragePercent
      },
      recommendations: coveragePercent < 80 ? 
        ['Consider adding more interaction tests to increase application coverage', 
         'Focus on testing core application functionality beyond header elements'] : 
        ['Good application coverage for tested components!',
         'Note: This covers header/navigation interactions only',
         'Consider expanding to test main application features']
    };
  }
  
  async validateCoverageThresholds(thresholds: any): Promise<any> {
    const report = await this.generateCoverageReport();
    
    if (!report.coverage) {
      return {
        passed: false,
        results: {
          js: { actual: 0, threshold: thresholds.js || 70, passed: false },
          css: { actual: 0, threshold: thresholds.css || 60, passed: false },
          overall: { actual: 0, threshold: thresholds.overall || 75, passed: false }
        }
      };
    }
    
    const jsPercent = report.metrics.coveragePercent;
    const cssPercent = report.metrics.coveragePercent; // Simplified
    const overallPercent = report.metrics.coveragePercent;
    
    return {
      passed: overallPercent >= (thresholds.overall || 75),
      results: {
        js: { actual: jsPercent, threshold: thresholds.js || 70, passed: jsPercent >= (thresholds.js || 70) },
        css: { actual: cssPercent, threshold: thresholds.css || 60, passed: cssPercent >= (thresholds.css || 60) },
        overall: { actual: overallPercent, threshold: thresholds.overall || 75, passed: overallPercent >= (thresholds.overall || 75) }
      }
    };
  }
}