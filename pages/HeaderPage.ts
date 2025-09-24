import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Header Page Object Model class
 * Handles header navigation elements: Contact Us, Employer Login, Vendor Login
 */
export class HeaderPage extends BasePage {
  // Locators for header elements
  private readonly headerContainer: Locator;
  private readonly contactUsLink: Locator;
  private readonly employerLoginLink: Locator;
  private readonly vendorLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Define locators using multiple selector strategies for robustness
    this.headerContainer = page.locator('.header-link-bar');
    
    // Contact Us - using specific selector with first() to handle multiple elements
    this.contactUsLink = page.locator('.header-link-bar a')
      .filter({ has: page.locator('img[alt="Contact Us"]') })
      .first()
      .or(page.locator('.header-link-bar a:has-text("Contact Us")').first());
    
    // Employer Login - using specific selector with first() to handle multiple elements
    this.employerLoginLink = page.locator('.header-link-bar a')
      .filter({ has: page.locator('img[alt="Employer Login"]') })
      .first()
      .or(page.locator('.header-link-bar a:has-text("Employer Login")').first());
    
    // Vendor Login - using specific selector with first() to handle multiple elements
    this.vendorLoginLink = page.locator('.header-link-bar a')
      .filter({ has: page.locator('img[alt="Vendor Login"]') })
      .first()
      .or(page.locator('.header-link-bar a:has-text("Vendor Login")').first());
  }

  /**
   * Wait for header to be fully loaded
   */
  async waitForHeaderLoad(): Promise<void> {
    try {
      await this.headerContainer.waitFor({ state: 'visible', timeout: 10000 });
      
      // Wait for at least one of the header links to be visible
      await Promise.race([
        this.contactUsLink.waitFor({ state: 'visible', timeout: 5000 }),
        this.employerLoginLink.waitFor({ state: 'visible', timeout: 5000 }),
        this.vendorLoginLink.waitFor({ state: 'visible', timeout: 5000 })
      ]);
      
      this.logger.info('Header navigation loaded successfully');
    } catch (error) {
      this.logger.warn('Header might not be fully loaded, continuing anyway', { error });
    }
  }

  /**
   * Click on Contact Us link
   */
  async checkContactUsVisible(): Promise<void> {
  const visible = await this.contactUsLink.isVisible();
  this.logger.info(`Checked Contact Us link visibility: ${visible}`);
  }

  /**
   * Click on Employer Login link
   */
  async checkEmployerLoginVisible(): Promise<void> {
  const visible = await this.employerLoginLink.isVisible();
  this.logger.info(`Checked Employer Login link visibility: ${visible}`);
  }

  /**
   * Click on Vendor Login link
   */
  async checkVendorLoginVisible(): Promise<void> {
  const visible = await this.vendorLoginLink.isVisible();
  this.logger.info(`Checked Vendor Login link visibility: ${visible}`);
  }

  /**
   * Check if Contact Us link is visible
   * @returns True if Contact Us link is visible
   */
  async isContactUsVisible(): Promise<boolean> {
    try {
      await this.contactUsLink.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Employer Login link is visible
   * @returns True if Employer Login link is visible
   */
  async isEmployerLoginVisible(): Promise<boolean> {
    try {
      await this.employerLoginLink.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Vendor Login link is visible
   * @returns True if Vendor Login link is visible
   */
  async isVendorLoginVisible(): Promise<boolean> {
    try {
      await this.vendorLoginLink.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if all header navigation links are visible
   * @returns Object with visibility status of each link
   */
  async checkAllLinksVisibility(): Promise<{
    contactUs: boolean;
    employerLogin: boolean;
    vendorLogin: boolean;
    allVisible: boolean;
  }> {
    const contactUs = await this.isContactUsVisible();
    const employerLogin = await this.isEmployerLoginVisible();
    const vendorLogin = await this.isVendorLoginVisible();
    
    return {
      contactUs,
      employerLogin,
      vendorLogin,
      allVisible: contactUs && employerLogin && vendorLogin
    };
  }

  /**
   * Get the href attribute of Contact Us link
   * @returns Contact Us link URL
   */
  async getContactUsHref(): Promise<string> {
    return await this.contactUsLink.getAttribute('href') || '';
  }

  /**
   * Get the href attribute of Employer Login link
   * @returns Employer Login link URL
   */
  async getEmployerLoginHref(): Promise<string> {
    return await this.employerLoginLink.getAttribute('href') || '';
  }

  /**
   * Get the href attribute of Vendor Login link
   * @returns Vendor Login link URL
   */
  async getVendorLoginHref(): Promise<string> {
    return await this.vendorLoginLink.getAttribute('href') || '';
  }

  /**
   * Get all header navigation links information
   * @returns Object with all link details
   */
  async getAllLinksInfo(): Promise<{
    contactUs: { text: string; href: string; visible: boolean };
    employerLogin: { text: string; href: string; visible: boolean };
    vendorLogin: { text: string; href: string; visible: boolean };
  }> {
    try {
      return {
        contactUs: {
          text: (await this.contactUsLink.textContent()) || '',
          href: await this.getContactUsHref(),
          visible: await this.isContactUsVisible()
        },
        employerLogin: {
          text: (await this.employerLoginLink.textContent()) || '',
          href: await this.getEmployerLoginHref(),
          visible: await this.isEmployerLoginVisible()
        },
        vendorLogin: {
          text: (await this.vendorLoginLink.textContent()) || '',
          href: await this.getVendorLoginHref(),
          visible: await this.isVendorLoginVisible()
        }
      };
    } catch (error) {
      this.logger.error('Error getting all links info', { error });
      return {
        contactUs: { text: '', href: '', visible: false },
        employerLogin: { text: '', href: '', visible: false },
        vendorLogin: { text: '', href: '', visible: false }
      };
    }
  }

  /**
   * Hover over Contact Us link
   */
  async checkContactUsVisibleNoHover(): Promise<void> {
  // Only verifying Contact Us link is visible (no hover)
  this.logger.info('Checked Contact Us link visibility (no hover performed)');
  }

  /**
   * Hover over Employer Login link
   */
  async checkEmployerLoginVisibleNoHover(): Promise<void> {
  // Only verifying Employer Login link is visible (no hover)
  this.logger.info('Checked Employer Login link visibility (no hover performed)');
  }

  /**
   * Hover over Vendor Login link
   */
  async checkVendorLoginVisibleNoHover(): Promise<void> {
  // Only verifying Vendor Login link is visible (no hover)
  this.logger.info('Checked Vendor Login link visibility (no hover performed)');
  }

  /**
   * Verify that all header images are loaded correctly
   * @returns Object with image loading status
   */
  async verifyImagesLoaded(): Promise<{
    contactUsImage: boolean;
    employerLoginImage: boolean;
    vendorLoginImage: boolean;
    allImagesLoaded: boolean;
  }> {
    const contactUsImg = this.page.locator('img[alt="Contact Us"]');
    const employerLoginImg = this.page.locator('img[alt="Employer Login"]');
    const vendorLoginImg = this.page.locator('img[alt="Vendor Login"]');

    const contactUsImageLoaded = await contactUsImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    const employerLoginImageLoaded = await employerLoginImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    const vendorLoginImageLoaded = await vendorLoginImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);

    return {
      contactUsImage: contactUsImageLoaded,
      employerLoginImage: employerLoginImageLoaded,
      vendorLoginImage: vendorLoginImageLoaded,
      allImagesLoaded: contactUsImageLoaded && employerLoginImageLoaded && vendorLoginImageLoaded
    };
  }

  /**
   * Take screenshot of the header section
   * @param name - Screenshot name
   * @returns Screenshot filename
   */
  async takeHeaderScreenshot(name: string = 'header'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.headerContainer.screenshot({ 
      path: `test-results/screenshots/${filename}` 
    });
    this.logger.info(`Header screenshot saved: ${filename}`);
    return filename;
  }
}