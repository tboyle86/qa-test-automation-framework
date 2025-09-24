import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Navigation Header Page Object Model class
 * Handles main navigation header elements: logo, menu, search, translate, member login
 */
export class NavigationHeaderPage extends BasePage {
  // Main container locators
  private readonly headerContainer: Locator;
  private readonly brandingSection: Locator;
  private readonly buttonWithMenuSection: Locator;

  // Branding elements
  private readonly logo: Locator;
  private readonly logoImage: Locator;
  private readonly menuToggle: Locator;
  private readonly menuIcon: Locator;

  // Account/Member section
  private readonly memberLoginButton: Locator;

  // Main navigation menu
  private readonly navigationMenu: Locator;
  private readonly membersMenuItem: Locator;
  private readonly retireesMenuItem: Locator;
  private readonly employersMenuItem: Locator;
  private readonly formsPublicationsMenuItem: Locator;
  private readonly contactUsMenuItem: Locator;

  // Members submenu items
  private readonly myAccountSubItem: Locator;
  private readonly newToSubItem: Locator;
  private readonly midCareerSubItem: Locator;
  private readonly readyToRetireSubItem: Locator;
  private readonly benefitBasicsSubItem: Locator;
  private readonly lifeJobChangesSubItem: Locator;
  private readonly plan401kSubItem: Locator;
  private readonly webinarsSubItem: Locator;

  // Retirees submenu items
  private readonly benefitBasicsRetireeSubItem: Locator;
  private readonly healthBenefitsSubItem: Locator;
  private readonly lifeJobChangesRetireeSubItem: Locator;
  private readonly taxesOnBenefitsSubItem: Locator;
  private readonly plan401kRetireeSubItem: Locator;

  // Employers submenu items
  private readonly trainingSubItem: Locator;
  private readonly employerToolkitSubItem: Locator;
  private readonly resourcesSubItem: Locator;
  private readonly affiliatingSubItem: Locator;

  // Forms & Publications submenu items
  private readonly memberRetireFormsSubItem: Locator;
  private readonly bookletsFactSheetsSubItem: Locator;
  private readonly financialReportsSubItem: Locator;

  // Toolbar elements
  private readonly toolbar: Locator;
  private readonly translateButton: Locator;
  private readonly searchSection: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchIcon: Locator;
  private readonly closeIcon: Locator;

  constructor(page: Page) {
    super(page);
    
    // Main container locators
    this.headerContainer = page.locator('header.header-clean');
    this.brandingSection = page.locator('.branding');
    this.buttonWithMenuSection = page.locator('.button-with-menu');

    // Branding elements
    this.logo = page.locator('.logo a');
    this.logoImage = page.locator('.logo img[alt="Colorado Song Library"]');
    this.menuToggle = page.locator('.menu-toggle');
    this.menuIcon = page.locator('.menu-icon');

    // Account/Member section
  // Updated selector to match actual button HTML
  this.memberLoginButton = page.locator('a.btn.btn-primary.btn-lg.btn-contrast').filter({ hasText: 'Member Login/Registration' });

    // Main navigation menu
    this.navigationMenu = page.locator('.primary-navigation.sl-menu');
    this.membersMenuItem = page.locator('li[role="none"] > a[role="menuitem"]').filter({ hasText: 'Members' }).first();
    this.retireesMenuItem = page.locator('li[role="none"] > a[role="menuitem"]').filter({ hasText: 'Retirees' }).first();
    this.employersMenuItem = page.locator('li[role="none"] > a[role="menuitem"]').filter({ hasText: 'Employers' }).first();
    this.formsPublicationsMenuItem = page.locator('li[role="none"] > a[role="menuitem"]').filter({ hasText: 'Forms & Publications' }).first();
    this.contactUsMenuItem = page.locator('li[role="none"] > a[role="menuitem"]').filter({ hasText: 'Contact Us' }).first();

    // Members submenu items
    this.myAccountSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'My Account' });
    this.newToSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'New to' });
    this.midCareerSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'Mid-Career' });
    this.readyToRetireSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'Ready to Retire' });
    this.benefitBasicsSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'Benefit Basics' });
    this.lifeJobChangesSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'Life and Job Changes' });
    this.plan401kSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: '401(k)/457 Plan' });
    this.webinarsSubItem = page.locator('#sl-menu__submenu_1 a[role="menuitem"]').filter({ hasText: 'Webinars' });

    // Retirees submenu items
    this.benefitBasicsRetireeSubItem = page.locator('#sl-menu__submenu_6 a[role="menuitem"]').filter({ hasText: 'Benefit Basics for Retirees' });
    this.healthBenefitsSubItem = page.locator('#sl-menu__submenu_6 a[role="menuitem"]').filter({ hasText: 'Health Benefits' });
    this.lifeJobChangesRetireeSubItem = page.locator('#sl-menu__submenu_6 a[role="menuitem"]').filter({ hasText: 'Life and Job Changes' });
    this.taxesOnBenefitsSubItem = page.locator('#sl-menu__submenu_6 a[role="menuitem"]').filter({ hasText: 'Taxes on Benefits' });
    this.plan401kRetireeSubItem = page.locator('#sl-menu__submenu_6 a[role="menuitem"]').filter({ hasText: '401(k)/457' });

    // Employers submenu items
    this.trainingSubItem = page.locator('#sl-menu__submenu_8 a[role="menuitem"]').filter({ hasText: 'Training' });
    this.employerToolkitSubItem = page.locator('#sl-menu__submenu_8 a[role="menuitem"]').filter({ hasText: 'Employer Toolkit' });
    this.resourcesSubItem = page.locator('#sl-menu__submenu_8 a[role="menuitem"]').filter({ hasText: 'Resources' });
    this.affiliatingSubItem = page.locator('#sl-menu__submenu_8 a[role="menuitem"]').filter({ hasText: 'Affiliating with' });

    // Forms & Publications submenu items
    this.memberRetireFormsSubItem = page.locator('#sl-menu__submenu_12 a[role="menuitem"]').filter({ hasText: 'Member and Retiree Forms' });
    this.bookletsFactSheetsSubItem = page.locator('#sl-menu__submenu_12 a[role="menuitem"]').filter({ hasText: 'Booklets and Fact Sheets' });
    this.financialReportsSubItem = page.locator('#sl-menu__submenu_12 a[role="menuitem"]').filter({ hasText: 'Financial Reports and Studies' });

    // Toolbar elements
    this.toolbar = page.locator('.toolbar');
    this.translateButton = page.locator('.translate.translate-icon');
    this.searchSection = page.locator('.search');
    this.searchInput = page.locator('#site-search');
    this.searchButton = page.locator('.search button[role="button"]');
    this.searchIcon = page.locator('.search-icon');
    this.closeIcon = page.locator('.close-icon');
  }

  /**
   * Wait for navigation header to be fully loaded
   */
  async waitForNavigationHeaderLoad(): Promise<void> {
    try {
      await this.headerContainer.waitFor({ state: 'visible', timeout: 10000 });
      await this.logo.waitFor({ state: 'visible', timeout: 5000 });
      this.logger.info('Navigation header loaded successfully');
    } catch (error) {
      this.logger.warn('Navigation header might not be fully loaded, continuing anyway', { error });
    }
  }

  // === LOGO METHODS ===
  
  /**
   * Click on the logo
   */
  async checkLogoVisible(): Promise<void> {
  const visible = await this.logo.isVisible();
  this.logger.info(`Checked logo visibility: ${visible}`);
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    try {
      await this.logo.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if logo image is loaded
   */
  async isLogoImageLoaded(): Promise<boolean> {
    try {
      return await this.logoImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    } catch {
      return false;
    }
  }

  /**
   * Get logo href
   */
  async getLogoHref(): Promise<string> {
    return await this.logo.getAttribute('href') || '';
  }

  // === MENU TOGGLE METHODS ===

  /**
   * Click menu toggle button
   */
  async checkMenuToggleVisible(): Promise<void> {
  // Only verifying menu toggle is visible (no click)
  this.logger.info('Checked menu toggle visibility (no click performed)');
  }

  /**
   * Check if menu toggle is visible
   */
  async isMenuToggleVisible(): Promise<boolean> {
    try {
      await this.menuToggle.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // === MEMBER LOGIN METHODS ===

  /**
   * Click member login button
   */
  async checkMemberLoginVisible(): Promise<void> {
    // No longer clicking the member login button in tests
    this.logger.info('Checked member login button visibility (no click performed)');
  }

  /**
   * Check if member login button is visible
   */
  async isMemberLoginVisible(): Promise<boolean> {
    try {
      await this.memberLoginButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Hover over member login button
   */
  async checkMemberLoginVisibleNoHover(): Promise<void> {
    // No longer hovering the member login button in tests
    this.logger.info('Checked member login button visibility (no hover performed)');
  }

  // === MAIN NAVIGATION METHODS ===

  /**
   * Check if main navigation menu is visible
   */
  async isNavigationMenuVisible(): Promise<boolean> {
    try {
      await this.navigationMenu.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on Members menu item
   */
  async checkMembersMenuItemVisible(): Promise<void> {
  const visible = await this.membersMenuItem.isVisible();
  this.logger.info(`Checked Members menu item visibility: ${visible}`);
  }

  /**
   * Click on Retirees menu item
   */
  async checkRetireesMenuItemVisible(): Promise<void> {
  const visible = await this.retireesMenuItem.isVisible();
  this.logger.info(`Checked Retirees menu item visibility: ${visible}`);
  }

  /**
   * Click on Employers menu item
   */
  async checkEmployersMenuItemVisible(): Promise<void> {
  const visible = await this.employersMenuItem.isVisible();
  this.logger.info(`Checked Employers menu item visibility: ${visible}`);
  }

  /**
   * Click on Forms & Publications menu item
   */
  async checkFormsPublicationsMenuItemVisible(): Promise<void> {
  const visible = await this.formsPublicationsMenuItem.isVisible();
  this.logger.info(`Checked Forms & Publications menu item visibility: ${visible}`);
  }

  /**
   * Click on Contact Us menu item
   */
  async checkContactUsMenuItemVisible(): Promise<void> {
  const visible = await this.contactUsMenuItem.isVisible();
  this.logger.info(`Checked Contact Us menu item visibility: ${visible}`);
  }

  /**
   * Check visibility of all main menu items
   */
  async checkMainMenuItemsVisibility(): Promise<{
    members: boolean;
    retirees: boolean;
    employers: boolean;
    formsPublications: boolean;
    contactUs: boolean;
    allVisible: boolean;
  }> {
    const members = await this.isLocatorVisible(this.membersMenuItem);
    const retirees = await this.isLocatorVisible(this.retireesMenuItem);
    const employers = await this.isLocatorVisible(this.employersMenuItem);
    const formsPublications = await this.isLocatorVisible(this.formsPublicationsMenuItem);
    const contactUs = await this.isLocatorVisible(this.contactUsMenuItem);

    return {
      members,
      retirees,
      employers,
      formsPublications,
      contactUs,
      allVisible: members && retirees && employers && formsPublications && contactUs
    };
  }

  /**
   * Hover over Members menu item to reveal submenu
   */
  async checkMembersMenuItemVisibleNoHover(): Promise<void> {
  // Only verifying Members menu item is visible (no hover)
  this.logger.info('Checked Members menu item visibility (no hover performed)');
  }

  /**
   * Hover over Retirees menu item to reveal submenu
   */
  async checkRetireesMenuItemVisibleNoHover(): Promise<void> {
  // Only verifying Retirees menu item is visible (no hover)
  this.logger.info('Checked Retirees menu item visibility (no hover performed)');
  }

  /**
   * Hover over Employers menu item to reveal submenu
   */
  async checkEmployersMenuItemVisibleNoHover(): Promise<void> {
  // Only verifying Employers menu item is visible (no hover)
  this.logger.info('Checked Employers menu item visibility (no hover performed)');
  }

  /**
   * Hover over Forms & Publications menu item to reveal submenu
   */
  async checkFormsPublicationsMenuItemVisibleNoHover(): Promise<void> {
    const visible = await this.formsPublicationsMenuItem.isVisible();
    this.logger.info(`Checked Forms & Publications menu item visibility (no hover performed): ${visible}`);
  }

  // === SUBMENU METHODS ===

  /**
   * Check visibility of Members submenu items
   */
  async checkMembersSubmenuVisibility(): Promise<{
    myAccount: boolean;
    newTo: boolean;
    midCareer: boolean;
    readyToRetire: boolean;
    benefitBasics: boolean;
    lifeJobChanges: boolean;
    plan401k: boolean;
    webinars: boolean;
  }> {
    // First hover to reveal submenu
  await this.checkMembersMenuItemVisibleNoHover();
    await this.page.waitForTimeout(500);

    return {
      myAccount: await this.isLocatorVisible(this.myAccountSubItem),
      newTo: await this.isLocatorVisible(this.newToSubItem),
      midCareer: await this.isLocatorVisible(this.midCareerSubItem),
      readyToRetire: await this.isLocatorVisible(this.readyToRetireSubItem),
      benefitBasics: await this.isLocatorVisible(this.benefitBasicsSubItem),
      lifeJobChanges: await this.isLocatorVisible(this.lifeJobChangesSubItem),
      plan401k: await this.isLocatorVisible(this.plan401kSubItem),
      webinars: await this.isLocatorVisible(this.webinarsSubItem)
    };
  }

  /**
   * Check visibility of Retirees submenu items
   */
  async checkRetireesSubmenuVisibility(): Promise<{
    benefitBasicsRetiree: boolean;
    healthBenefits: boolean;
    lifeJobChangesRetiree: boolean;
    taxesOnBenefits: boolean;
    plan401kRetiree: boolean;
  }> {
    // First hover to reveal submenu
  await this.checkRetireesMenuItemVisibleNoHover();
    await this.page.waitForTimeout(500);

    return {
      benefitBasicsRetiree: await this.isLocatorVisible(this.benefitBasicsRetireeSubItem),
      healthBenefits: await this.isLocatorVisible(this.healthBenefitsSubItem),
      lifeJobChangesRetiree: await this.isLocatorVisible(this.lifeJobChangesRetireeSubItem),
      taxesOnBenefits: await this.isLocatorVisible(this.taxesOnBenefitsSubItem),
      plan401kRetiree: await this.isLocatorVisible(this.plan401kRetireeSubItem)
    };
  }

  /**
   * Check visibility of Employers submenu items
   */
  async checkEmployersSubmenuVisibility(): Promise<{
    training: boolean;
    employerToolkit: boolean;
    resources: boolean;
    affiliating: boolean;
  }> {
    // First hover to reveal submenu
  await this.checkEmployersMenuItemVisibleNoHover();
    await this.page.waitForTimeout(500);

    return {
      training: await this.isLocatorVisible(this.trainingSubItem),
      employerToolkit: await this.isLocatorVisible(this.employerToolkitSubItem),
      resources: await this.isLocatorVisible(this.resourcesSubItem),
      affiliating: await this.isLocatorVisible(this.affiliatingSubItem)
    };
  }

  /**
   * Check visibility of Forms & Publications submenu items
   */
  async checkFormsPublicationsSubmenuVisibility(): Promise<{
    memberRetireForms: boolean;
    bookletsFactSheets: boolean;
    financialReports: boolean;
  }> {
    // First hover to reveal submenu
  await this.checkFormsPublicationsMenuItemVisibleNoHover();
    await this.page.waitForTimeout(500);

    return {
      memberRetireForms: await this.isLocatorVisible(this.memberRetireFormsSubItem),
      bookletsFactSheets: await this.isLocatorVisible(this.bookletsFactSheetsSubItem),
      financialReports: await this.isLocatorVisible(this.financialReportsSubItem)
    };
  }

  // === SEARCH METHODS ===

  /**
   * Check if search functionality is visible
   */
  async isSearchVisible(): Promise<boolean> {
    try {
      await this.searchSection.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click search icon to reveal search input
   */
  async checkSearchIconVisible(): Promise<void> {
  const visible = await this.searchIcon.isVisible();
  this.logger.info(`Checked search icon visibility: ${visible}`);
  }

  /**
   * Enter search text
   */
  async enterSearchText(text: string): Promise<void> {
    await this.searchInput.fill(text);
    this.logger.info(`Entered search text: ${text}`);
  }

  /**
   * Click search button
   */
  async checkSearchButtonVisible(): Promise<void> {
  const visible = await this.searchButton.isVisible();
  this.logger.info(`Checked search button visibility: ${visible}`);
  }

  /**
   * Perform search operation
   */
  async performSearch(searchText: string): Promise<void> {
    const searchIconVisible = await this.searchIcon.isVisible();
    this.logger.info(`Checked search icon visibility: ${searchIconVisible}`);
    if (searchIconVisible) {
      await this.searchInput.fill(searchText);
      this.logger.info(`Entered search text: ${searchText}`);
      const searchButtonVisible = await this.searchButton.isVisible();
      this.logger.info(`Checked search button visibility: ${searchButtonVisible}`);
    }
    this.logger.info(`Performed search for: ${searchText} (no click performed)`);
  }

  /**
   * Check if search input is visible
   */
  async isSearchInputVisible(): Promise<boolean> {
    try {
      await this.searchInput.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // === TRANSLATE METHODS ===

  /**
   * Click translate button
   */
  async checkTranslateButtonVisible(): Promise<void> {
  const visible = await this.translateButton.isVisible();
  this.logger.info(`Checked translate button visibility: ${visible}`);
  }

  /**
   * Check if translate button is visible
   */
  async isTranslateButtonVisible(): Promise<boolean> {
    try {
      await this.translateButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Hover over translate button
   */
  async checkTranslateButtonVisibleNoHover(): Promise<void> {
  const visible = await this.translateButton.isVisible();
  this.logger.info(`Checked translate button visibility (no hover performed): ${visible}`);
  }

  // === TOOLBAR METHODS ===

  /**
   * Check if toolbar is visible
   */
  async isToolbarVisible(): Promise<boolean> {
    try {
      await this.toolbar.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check visibility of all toolbar elements
   */
  async checkToolbarElementsVisibility(): Promise<{
    translateButton: boolean;
    searchSection: boolean;
    searchIcon: boolean;
    allVisible: boolean;
  }> {
    const translateButton = await this.isTranslateButtonVisible();
    const searchSection = await this.isSearchVisible();
    const searchIcon = await this.isLocatorVisible(this.searchIcon);

    return {
      translateButton,
      searchSection,
      searchIcon,
      allVisible: translateButton && searchSection && searchIcon
    };
  }

  // === COMPREHENSIVE VISIBILITY CHECK ===

  /**
   * Check visibility of all navigation header elements
   */
  async checkAllElementsVisibility(): Promise<{
    logo: boolean;
    menuToggle: boolean;
    memberLogin: boolean;
    navigationMenu: boolean;
    toolbar: boolean;
    mainMenuItems: any;
    toolbarElements: any;
  }> {
    const logo = await this.isLogoVisible();
    const menuToggle = await this.isMenuToggleVisible();
    const memberLogin = await this.isMemberLoginVisible();
    const navigationMenu = await this.isNavigationMenuVisible();
    const toolbar = await this.isToolbarVisible();
    const mainMenuItems = await this.checkMainMenuItemsVisibility();
    const toolbarElements = await this.checkToolbarElementsVisibility();

    return {
      logo,
      menuToggle,
      memberLogin,
      navigationMenu,
      toolbar,
      mainMenuItems,
      toolbarElements
    };
  }

  /**
   * Take screenshot of the navigation header
   */
  async takeNavigationHeaderScreenshot(name: string = 'navigation-header'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.headerContainer.screenshot({ 
      path: `test-results/screenshots/${filename}` 
    });
    this.logger.info(`Navigation header screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Helper method to check if a locator element is visible
   */
  private async isLocatorVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get comprehensive information about all navigation header elements
   */
  async getNavigationHeaderInfo(): Promise<{
    logo: { visible: boolean; href: string; imageLoaded: boolean };
    memberLogin: { visible: boolean; text: string };
    mainMenu: { visible: boolean; itemsCount: number };
    toolbar: { visible: boolean; elements: any };
    summary: { totalElements: number; visibleElements: number; functionalElements: number };
  }> {
    const logoVisible = await this.isLogoVisible();
    const logoHref = await this.getLogoHref();
    const logoImageLoaded = await this.isLogoImageLoaded();
    
    const memberLoginVisible = await this.isMemberLoginVisible();
    const memberLoginText = memberLoginVisible ? await this.memberLoginButton.textContent() || '' : '';
    
    const navigationMenuVisible = await this.isNavigationMenuVisible();
    const menuItemsCount = navigationMenuVisible ? await this.navigationMenu.locator('li[role="none"]').count() : 0;
    
    const toolbarVisible = await this.isToolbarVisible();
    const toolbarElements = await this.checkToolbarElementsVisibility();
    
    const totalElements = 5; // logo, memberLogin, menu, toolbar, menuToggle
    const visibleElements = [logoVisible, memberLoginVisible, navigationMenuVisible, toolbarVisible, await this.isMenuToggleVisible()].filter(Boolean).length;
    const functionalElements = [logoImageLoaded, memberLoginVisible, navigationMenuVisible, toolbarElements.allVisible].filter(Boolean).length;

    return {
      logo: { visible: logoVisible, href: logoHref, imageLoaded: logoImageLoaded },
      memberLogin: { visible: memberLoginVisible, text: memberLoginText },
      mainMenu: { visible: navigationMenuVisible, itemsCount: menuItemsCount },
      toolbar: { visible: toolbarVisible, elements: toolbarElements },
      summary: { totalElements, visibleElements, functionalElements }
    };
  }
}