import { Page, Locator } from '@playwright/test';
import * as winston from 'winston';

/**
 * Base Page Object Model class
 * Contains common functionality shared across all page objects
 */
export class BasePage {
  protected page: Page;
  protected logger: winston.Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = this.setupLogger();
  }

  /**
   * Setup Winston logger for test logging
   */
  protected setupLogger(): winston.Logger {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'playwright-tests' },
      transports: [
        new winston.transports.File({ filename: 'test-logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'test-logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    this.logger.info(`Navigated to: ${url}`);
  }

  /**
   * Wait for element to be visible with timeout
   * @param selector - Element selector
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Click an element
   * @param selector - Element selector
   */
  async clickElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.click();
    this.logger.info(`Clicked element: ${selector}`);
  }

  /**
   * Fill input field with value
   * @param selector - Input selector
   * @param value - Value to fill
   */
  async fillInput(selector: string, value: string): Promise<void> {
    const input = this.page.locator(selector);
    await input.waitFor({ state: 'visible' });
    await input.clear();
    await input.fill(value);
    this.logger.info(`Filled input ${selector} with value: ${value}`);
  }

  /**
   * Get text content of an element
   * @param selector - Element selector
   * @returns Text content
   */
  async getTextContent(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    const text = await element.textContent();
    return text || '';
  }

  /**
   * Take screenshot with timestamp
   * @param name - Screenshot name
   * @returns Screenshot filename
   */
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    });
    this.logger.info(`Screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Check if element exists and is visible
   * @param selector - Element selector
   * @returns True if element exists and is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 2000 
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Page loaded completely');
  }

  /**
   * Get page title
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns Current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
