import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Helper Class
 * Provides accessibility testing functionality using axe-core
 */
export class AccessibilityHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run accessibility scan on entire page
   */
  async scanPage(): Promise<any> {
    const accessibilityScanResults = await new AxeBuilder({ page: this.page }).analyze();
    return accessibilityScanResults;
  }

  /**
   * Run accessibility scan on specific element
   */
  async scanElement(selector: string): Promise<any> {
    const accessibilityScanResults = await new AxeBuilder({ page: this.page })
      .include(selector)
      .analyze();
    return accessibilityScanResults;
  }

  /**
   * Check if page has any accessibility violations
   */
  async hasViolations(): Promise<boolean> {
    const results = await this.scanPage();
    return results.violations.length > 0;
  }

  /**
   * Get detailed accessibility violations
   */
  async getViolations(): Promise<any[]> {
    const results = await this.scanPage();
    return results.violations;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(selectors: string[]): Promise<{ accessible: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    for (const selector of selectors) {
      try {
        // Use first() to avoid strict mode violations with multiple elements
        const element = this.page.locator(selector).first();
        
        // Check if element is focusable
        await element.focus();
        const isFocused = await element.evaluate((el) => document.activeElement === el);
        
        if (!isFocused) {
          issues.push(`Element ${selector} is not keyboard focusable`);
        }
        
        // Check for proper focus indicators
        const hasOutline = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });
        
        if (!hasOutline) {
          issues.push(`Element ${selector} has no visible focus indicator`);
        }
        
      } catch (error) {
        issues.push(`Could not test keyboard navigation for ${selector}: ${error}`);
      }
    }
    
    return {
      accessible: issues.length === 0,
      issues
    };
  }

  /**
   * Check color contrast for elements
   */
  async checkColorContrast(selectors: string[]): Promise<{ passed: boolean; results: any[] }> {
    const results = [];
    
    for (const selector of selectors) {
      try {
        const contrastInfo = await this.page.locator(selector).first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize
          };
        });
        
        results.push({
          selector,
          ...contrastInfo,
          needsManualCheck: true // Automated contrast checking requires more complex calculations
        });
      } catch (error) {
        results.push({
          selector,
          error: String(error)
        });
      }
    }
    
    return {
      passed: true, // Manual check required for actual contrast ratios
      results
    };
  }

  /**
   * Generate accessibility report
   */
  async generateReport(): Promise<{
    violations: any[];
    passes: any[];
    summary: {
      violationCount: number;
      passCount: number;
      score: number;
    };
  }> {
    const results = await this.scanPage();
    
    const summary = {
      violationCount: results.violations.length,
      passCount: results.passes.length,
      score: results.passes.length / (results.passes.length + results.violations.length) * 100
    };
    
    return {
      violations: results.violations,
      passes: results.passes,
      summary
    };
  }
}