import { Page, expect } from '@playwright/test';

/**
 * Test Utilities for Header Navigation Testing
 */
export class TestUtils {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  /**
   * Take a full page screenshot with timestamp
   */
  async takeFullPageScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `test-results/screenshots/${name}-${timestamp}.png`;
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    return screenshotPath;
  }

  /**
   * Verify link opens in new tab
   */
  async verifyLinkOpensInNewTab(selector: string): Promise<boolean> {
    const target = await this.page.getAttribute(selector, 'target');
    return target === '_blank';
  }

  /**
   * Get element computed styles
   */
  async getElementStyles(selector: string): Promise<CSSStyleDeclaration | null> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      return window.getComputedStyle(element);
    }, selector);
  }

  /**
   * Check if element is in viewport
   */
  async isElementInViewport(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }

  /**
   * Simulate slow network conditions
   */
  async simulateSlowNetwork(): Promise<void> {
    await this.page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
      await route.continue();
    });
  }

  /**
   * Get page performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
  }

  /**
   * Check accessibility of element
   */
  async checkElementAccessibility(selector: string): Promise<{
    hasAltText: boolean;
    hasAriaLabel: boolean;
    hasTitle: boolean;
    isKeyboardAccessible: boolean;
  }> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) {
        return {
          hasAltText: false,
          hasAriaLabel: false,
          hasTitle: false,
          isKeyboardAccessible: false
        };
      }

      return {
        hasAltText: element.hasAttribute('alt') && element.getAttribute('alt') !== '',
        hasAriaLabel: element.hasAttribute('aria-label') && element.getAttribute('aria-label') !== '',
        hasTitle: element.hasAttribute('title') && element.getAttribute('title') !== '',
        isKeyboardAccessible: element.getAttribute('tabindex') !== '-1'
      };
    }, selector);
  }

  /**
   * Verify element animation state
   */
  async isElementAnimating(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;

      const computedStyle = window.getComputedStyle(element);
      const animationName = computedStyle.animationName;
      const transitionProperty = computedStyle.transitionProperty;

      return animationName !== 'none' || transitionProperty !== 'none';
    }, selector);
  }

  /**
   * Wait for CSS animation to complete
   */
  async waitForAnimationComplete(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForFunction(
      (sel) => {
        const element = document.querySelector(sel);
        if (!element) return true;

        const computedStyle = window.getComputedStyle(element);
        return computedStyle.animationName === 'none';
      },
      selector,
      { timeout }
    );
  }

  /**
   * Get console errors from the page
   */
  getConsoleErrors(): string[] {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  /**
   * Assert no console errors
   */
  async assertNoConsoleErrors(): Promise<void> {
    const errors = this.getConsoleErrors();
    expect(errors).toHaveLength(0);
  }

  /**
   * Simulate mobile device
   */
  async simulateMobileDevice(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });
  }

  /**
   * Simulate tablet device
   */
  async simulateTabletDevice(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });
  }

  /**
   * Check if page is responsive
   */
  async checkResponsiveness(): Promise<{
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  }> {
    const results = {
      mobile: false,
      tablet: false,
      desktop: false
    };

    // Test mobile
    await this.simulateMobileDevice();
    await this.waitForPageLoad();
    results.mobile = await this.isElementInViewport('.header-link-bar');

    // Test tablet
    await this.simulateTabletDevice();
    await this.waitForPageLoad();
    results.tablet = await this.isElementInViewport('.header-link-bar');

    // Test desktop
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForPageLoad();
    results.desktop = await this.isElementInViewport('.header-link-bar');

    return results;
  }
}

/**
 * Custom Playwright matchers for better assertions
 */
export const customMatchers = {
  /**
   * Check if element is visible and in viewport
   */
  async toBeVisibleInViewport(locator: any) {
    const isVisible = await locator.isVisible();
    const isInViewport = await locator.evaluate((element: Element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });

    return {
      pass: isVisible && isInViewport,
      message: () => `Element is ${isVisible ? 'visible' : 'not visible'} and ${isInViewport ? 'in' : 'not in'} viewport`
    };
  }
};

/**
 * Test data generators
 */
export class TestDataGenerator {
  /**
   * Generate test viewport sizes
   */
  static getViewportSizes(): Array<{ name: string; width: number; height: number }> {
    return [
      { name: 'mobile-portrait', width: 375, height: 667 },
      { name: 'mobile-landscape', width: 667, height: 375 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop-small', width: 1366, height: 768 },
      { name: 'desktop-large', width: 1920, height: 1080 },
      { name: 'desktop-xl', width: 2560, height: 1440 }
    ];
  }

  /**
   * Generate test browser contexts
   */
  static getBrowserContexts(): Array<{ name: string; userAgent: string; viewport: { width: number; height: number } }> {
    return [
      {
        name: 'chrome-desktop',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 }
      },
      {
        name: 'safari-mobile',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 375, height: 667 }
      },
      {
        name: 'firefox-desktop',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        viewport: { width: 1920, height: 1080 }
      }
    ];
  }
}