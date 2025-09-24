import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Song Library Page Object Model
 * Handles all song library functionality including CRUD operations, filtering, sorting
 * All methods use visibility-only checks with detailed logging (no interactions)
 */
export class SongLibraryPage extends BasePage {
  // Header locators
  readonly pageHeader: Locator;
  readonly songLibraryTitle: Locator;

  // Filter section locators
  readonly dateFilterSection: Locator;
  readonly dateFilterInput: Locator;
  readonly dateFilterLabel: Locator;
  readonly filterButton: Locator;
  readonly cancelFilterButton: Locator;

  // Add song section locators
  readonly addSongSection: Locator;
  readonly addNewSongButton: Locator;

  // Table structure locators
  readonly songTable: Locator;
  readonly tableHeader: Locator;
  readonly titleHeader: Locator;
  readonly artistHeader: Locator;
  readonly releaseDateHeader: Locator;
  readonly priceHeader: Locator;

  // Song row locators
  readonly songRows: Locator;
  readonly firstSongRow: Locator;

  // Form field locators (for song entries)
  readonly titleInputs: Locator;
  readonly artistInputs: Locator;
  readonly releaseDateInputs: Locator;
  readonly priceInputs: Locator;

  // Action button locators
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly saveButtons: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header selectors
    this.pageHeader = page.locator('app-header header');
    this.songLibraryTitle = page.locator('app-header header h2');

    // Filter section selectors
    this.dateFilterSection = page.locator('#date-filter');
    this.dateFilterInput = page.locator('#date-filter input[type="date"]');
    this.dateFilterLabel = page.locator('#date-filter mat-label:has-text("Released before:")');
    this.filterButton = page.locator('#date-filter button:has-text("Filter")');
    this.cancelFilterButton = page.locator('#date-filter button:has-text("Cancel")');

    // Add song section selectors
    this.addSongSection = page.locator('.table-header');
    this.addNewSongButton = page.locator('button:has-text("Add New Song")');

    // Table structure selectors
    this.songTable = page.locator('#song-table');
    this.tableHeader = page.locator('#song-table .theader');
    this.titleHeader = page.locator('.table_header[data-name="title"]');
    this.artistHeader = page.locator('.table_header[data-name="artist"]');
    this.releaseDateHeader = page.locator('.table_header[data-name="releaseDay"]');
    this.priceHeader = page.locator('.table_header[data-name="price"]');

    // Song row selectors
    this.songRows = page.locator('.table_row');
    this.firstSongRow = page.locator('.table_row').first();

    // Form field selectors
    this.titleInputs = page.locator('input[name="title"]');
    this.artistInputs = page.locator('input[name="artist"]');
    this.releaseDateInputs = page.locator('input[name="releaseDay"]');
    this.priceInputs = page.locator('input[name="price"]');

    // Action button selectors
    this.editButtons = page.locator('button:has-text("Edit")');
    this.deleteButtons = page.locator('button:has-text("Delete")');
    this.saveButtons = page.locator('button:has-text("Save")');
  }

  /**
   * Check if page header is visible (visibility-only)
   */
  async isPageHeaderVisible(): Promise<boolean> {
    console.log('🔍 Checking if song library page header is visible...');
    const isVisible = await this.pageHeader.isVisible();
    console.log(`📍 Page header visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if song library title is visible and get text (visibility-only)
   */
  async isSongLibraryTitleVisible(): Promise<boolean> {
    console.log('🔍 Checking if song library title is visible...');
    const isVisible = await this.songLibraryTitle.isVisible();
    if (isVisible) {
      const titleText = await this.songLibraryTitle.textContent();
      console.log(`📍 Song library title: "${titleText}" - ✅ Visible`);
    } else {
      console.log('📍 Song library title: ❌ Not visible');
    }
    return isVisible;
  }

  /**
   * Check if date filter section is visible (visibility-only)
   */
  async isDateFilterSectionVisible(): Promise<boolean> {
    console.log('🔍 Checking if date filter section is visible...');
    const isVisible = await this.dateFilterSection.isVisible();
    console.log(`📍 Date filter section visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if date filter input is visible (visibility-only)
   */
  async isDateFilterInputVisible(): Promise<boolean> {
    console.log('🔍 Checking if date filter input is visible...');
    const isVisible = await this.dateFilterInput.isVisible();
    console.log(`📍 Date filter input visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if filter buttons are visible (visibility-only)
   */
  async areFilterButtonsVisible(): Promise<{ filter: boolean; cancel: boolean }> {
    console.log('🔍 Checking if filter buttons are visible...');
    const filterVisible = await this.filterButton.isVisible();
    const cancelVisible = await this.cancelFilterButton.isVisible();
    
    console.log(`📍 Filter button visibility: ${filterVisible ? '✅ Visible' : '❌ Not visible'}`);
    console.log(`📍 Cancel filter button visibility: ${cancelVisible ? '✅ Visible' : '❌ Not visible'}`);
    
    return { filter: filterVisible, cancel: cancelVisible };
  }

  /**
   * Check if add new song button is visible (visibility-only)
   */
  async isAddNewSongButtonVisible(): Promise<boolean> {
    console.log('🔍 Checking if add new song button is visible...');
    const isVisible = await this.addNewSongButton.isVisible();
    console.log(`📍 Add new song button visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if song table is visible (visibility-only)
   */
  async isSongTableVisible(): Promise<boolean> {
    console.log('🔍 Checking if song table is visible...');
    const isVisible = await this.songTable.isVisible();
    console.log(`📍 Song table visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if table headers are visible (visibility-only)
   */
  async areTableHeadersVisible(): Promise<{
    title: boolean;
    artist: boolean;
    releaseDate: boolean;
    price: boolean;
  }> {
    console.log('🔍 Checking if table headers are visible...');
    
    // More resilient approach - try to wait for table headers but don't fail the test if timeout
    try {
      await this.page.waitForSelector('.table_header', { timeout: 5000 });
    } catch (error) {
      console.log('⚠️ Table header timeout - checking visibility without strict wait');
    }
    
    // Check visibility with individual timeouts for responsive scenarios
    const titleVisible = await this.titleHeader.isVisible().catch(() => false);
    const artistVisible = await this.artistHeader.isVisible().catch(() => false);
    const releaseDateVisible = await this.releaseDateHeader.isVisible().catch(() => false);
    const priceVisible = await this.priceHeader.isVisible().catch(() => false);
    
    console.log(`📍 Title header visibility: ${titleVisible ? '✅ Visible' : '❌ Not visible'}`);
    console.log(`📍 Artist header visibility: ${artistVisible ? '✅ Visible' : '❌ Not visible'}`);
    console.log(`📍 Release Date header visibility: ${releaseDateVisible ? '✅ Visible' : '❌ Not visible'}`);
    console.log(`📍 Price header visibility: ${priceVisible ? '✅ Visible' : '❌ Not visible'}`);
    
    return {
      title: titleVisible,
      artist: artistVisible,
      releaseDate: releaseDateVisible,
      price: priceVisible
    };
  }

  /**
   * Get count of visible song rows (visibility-only)
   */
  async getSongRowCount(): Promise<number> {
    console.log('🔍 Counting visible song rows...');
    const count = await this.songRows.count();
    console.log(`📍 Song row count: ${count}`);
    return count;
  }

  /**
   * Check if specific song row is visible by index (visibility-only)
   */
  async isSongRowVisible(index: number): Promise<boolean> {
    console.log(`🔍 Checking if song row ${index} is visible...`);
    const songRow = this.songRows.nth(index);
    const isVisible = await songRow.isVisible();
    console.log(`📍 Song row ${index} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if first song row is visible (visibility-only)
   */
  async isFirstSongRowVisible(): Promise<boolean> {
    console.log('🔍 Checking if first song row is visible...');
    const isVisible = await this.firstSongRow.isVisible();
    console.log(`📍 First song row visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    return isVisible;
  }

  /**
   * Check if title inputs are visible (visibility-only)
   */
  async areTitleInputsVisible(): Promise<boolean> {
    console.log('🔍 Checking if title inputs are visible...');
    const count = await this.titleInputs.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.titleInputs.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Title input ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All title inputs visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if artist inputs are visible (visibility-only)
   */
  async areArtistInputsVisible(): Promise<boolean> {
    console.log('🔍 Checking if artist inputs are visible...');
    const count = await this.artistInputs.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.artistInputs.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Artist input ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All artist inputs visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if release date inputs are visible (visibility-only)
   */
  async areReleaseDateInputsVisible(): Promise<boolean> {
    console.log('🔍 Checking if release date inputs are visible...');
    const count = await this.releaseDateInputs.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.releaseDateInputs.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Release date input ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All release date inputs visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if price inputs are visible (visibility-only)
   */
  async arePriceInputsVisible(): Promise<boolean> {
    console.log('🔍 Checking if price inputs are visible...');
    const count = await this.priceInputs.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.priceInputs.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Price input ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All price inputs visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if edit buttons are visible (visibility-only)
   */
  async areEditButtonsVisible(): Promise<boolean> {
    console.log('🔍 Checking if edit buttons are visible...');
    const count = await this.editButtons.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.editButtons.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Edit button ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All edit buttons visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if delete buttons are visible (visibility-only)
   */
  async areDeleteButtonsVisible(): Promise<boolean> {
    console.log('🔍 Checking if delete buttons are visible...');
    const count = await this.deleteButtons.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.deleteButtons.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Delete button ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All delete buttons visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Check if save buttons are visible (visibility-only)
   */
  async areSaveButtonsVisible(): Promise<boolean> {
    console.log('🔍 Checking if save buttons are visible...');
    const count = await this.saveButtons.count();
    let allVisible = true;
    
    for (let i = 0; i < count; i++) {
      const isVisible = await this.saveButtons.nth(i).isVisible();
      if (!isVisible) {
        allVisible = false;
      }
      console.log(`📍 Save button ${i} visibility: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
    }
    
    console.log(`📍 All save buttons visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    return allVisible;
  }

  /**
   * Get song data from specific row (visibility-only data retrieval)
   */
  async getSongDataFromRow(index: number): Promise<{
    title: string | null;
    artist: string | null;
    releaseDate: string | null;
    price: string | null;
  }> {
    console.log(`🔍 Getting song data from row ${index}...`);
    
    const titleValue = await this.titleInputs.nth(index).inputValue();
    const artistValue = await this.artistInputs.nth(index).inputValue();
    const releaseDateValue = await this.releaseDateInputs.nth(index).inputValue();
    const priceValue = await this.priceInputs.nth(index).inputValue();
    
    const songData = {
      title: titleValue,
      artist: artistValue,
      releaseDate: releaseDateValue,
      price: priceValue
    };
    
    console.log(`📍 Song data from row ${index}:`, songData);
    return songData;
  }

  /**
   * Get all song data from table (visibility-only data retrieval)
   */
  async getAllSongData(): Promise<Array<{
    title: string | null;
    artist: string | null;
    releaseDate: string | null;
    price: string | null;
  }>> {
    console.log('🔍 Getting all song data from table...');
    
    const rowCount = await this.getSongRowCount();
    const allSongData = [];
    
    for (let i = 0; i < rowCount; i++) {
      const songData = await this.getSongDataFromRow(i);
      allSongData.push(songData);
    }
    
    console.log(`📍 Retrieved ${allSongData.length} song records`);
    console.log('📊 All song data:', allSongData);
    
    return allSongData;
  }

  /**
   * Check if initial 5 songs are loaded (as per test plan requirement)
   */
  async areInitialSongsLoaded(): Promise<boolean> {
    console.log('🔍 Checking if initial 5 songs are loaded...');
    const songCount = await this.getSongRowCount();
    const hasExpectedCount = songCount === 5;
    
    console.log(`📍 Expected: 5 songs, Actual: ${songCount} songs`);
    console.log(`📍 Initial songs loaded correctly: ${hasExpectedCount ? '✅ Yes' : '❌ No'}`);
    
    return hasExpectedCount;
  }

  /**
   * Verify all song rows have required data fields (visibility-only validation)
   */
  async verifyAllSongsHaveRequiredFields(): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    console.log('🔍 Verifying all songs have required fields...');
    
    const allSongData = await this.getAllSongData();
    const issues: string[] = [];
    
    allSongData.forEach((song, index) => {
      if (!song.title || song.title.trim() === '') {
        issues.push(`Row ${index}: Missing title`);
      }
      if (!song.artist || song.artist.trim() === '') {
        issues.push(`Row ${index}: Missing artist`);
      }
      if (!song.releaseDate || song.releaseDate.trim() === '') {
        issues.push(`Row ${index}: Missing release date`);
      }
      if (!song.price || song.price.trim() === '') {
        issues.push(`Row ${index}: Missing price`);
      }
    });
    
    const isValid = issues.length === 0;
    
    console.log(`📍 All songs have required fields: ${isValid ? '✅ Yes' : '❌ No'}`);
    if (issues.length > 0) {
      console.log('⚠️ Validation issues found:', issues);
    }
    
    return { valid: isValid, issues };
  }

  /**
   * Check table header sorting attributes (visibility-only)
   */
  async getTableHeaderSortingInfo(): Promise<{
    title: { order: string | null; name: string | null };
    artist: { order: string | null; name: string | null };
    releaseDate: { order: string | null; name: string | null };
    price: { order: string | null; name: string | null };
  }> {
    console.log('🔍 Getting table header sorting information...');
    
    const titleOrder = await this.titleHeader.getAttribute('data-order');
    const titleName = await this.titleHeader.getAttribute('data-name');
    const artistOrder = await this.artistHeader.getAttribute('data-order');
    const artistName = await this.artistHeader.getAttribute('data-name');
    const releaseDateOrder = await this.releaseDateHeader.getAttribute('data-order');
    const releaseDateName = await this.releaseDateHeader.getAttribute('data-name');
    const priceOrder = await this.priceHeader.getAttribute('data-order');
    const priceName = await this.priceHeader.getAttribute('data-name');
    
    const sortingInfo = {
      title: { order: titleOrder, name: titleName },
      artist: { order: artistOrder, name: artistName },
      releaseDate: { order: releaseDateOrder, name: releaseDateName },
      price: { order: priceOrder, name: priceName }
    };
    
    console.log('📍 Table header sorting info:', sortingInfo);
    return sortingInfo;
  }

  /**
   * Comprehensive visibility check for all page elements
   */
  async checkAllElementsVisibility(): Promise<{
    header: boolean;
    title: boolean;
    dateFilter: boolean;
    filterButtons: { filter: boolean; cancel: boolean };
    addButton: boolean;
    table: boolean;
    tableHeaders: { title: boolean; artist: boolean; releaseDate: boolean; price: boolean };
    songRows: number;
    formInputs: { titles: boolean; artists: boolean; dates: boolean; prices: boolean };
    actionButtons: { edit: boolean; delete: boolean; save: boolean };
    allVisible: boolean;
  }> {
    console.log('🔍 Performing comprehensive visibility check...');
    
    const header = await this.isPageHeaderVisible();
    const title = await this.isSongLibraryTitleVisible();
    const dateFilter = await this.isDateFilterSectionVisible();
    const filterButtons = await this.areFilterButtonsVisible();
    const addButton = await this.isAddNewSongButtonVisible();
    const table = await this.isSongTableVisible();
    const tableHeaders = await this.areTableHeadersVisible();
    const songRows = await this.getSongRowCount();
    
    const formInputs = {
      titles: await this.areTitleInputsVisible(),
      artists: await this.areArtistInputsVisible(),
      dates: await this.areReleaseDateInputsVisible(),
      prices: await this.arePriceInputsVisible()
    };
    
    const actionButtons = {
      edit: await this.areEditButtonsVisible(),
      delete: await this.areDeleteButtonsVisible(),
      save: await this.areSaveButtonsVisible()
    };
    
    const allVisible = header && title && dateFilter && 
                      filterButtons.filter && filterButtons.cancel &&
                      addButton && table && 
                      tableHeaders.title && tableHeaders.artist && 
                      tableHeaders.releaseDate && tableHeaders.price &&
                      songRows > 0 && formInputs.titles && formInputs.artists &&
                      formInputs.dates && formInputs.prices &&
                      actionButtons.edit && actionButtons.delete && actionButtons.save;
    
    const visibilityReport = {
      header,
      title,
      dateFilter,
      filterButtons,
      addButton,
      table,
      tableHeaders,
      songRows,
      formInputs,
      actionButtons,
      allVisible
    };
    
    console.log('📊 Comprehensive visibility report:', visibilityReport);
    console.log(`📍 All elements visible: ${allVisible ? '✅ Yes' : '❌ No'}`);
    
    return visibilityReport;
  }

  /**
   * Check button states (enabled/disabled) - visibility-only
   */
  async getButtonStates(): Promise<{
    addButton: { visible: boolean; enabled: boolean };
    filterButton: { visible: boolean; enabled: boolean };
    cancelButton: { visible: boolean; enabled: boolean };
    editButtons: Array<{ visible: boolean; enabled: boolean }>;
    deleteButtons: Array<{ visible: boolean; enabled: boolean }>;
    saveButtons: Array<{ visible: boolean; enabled: boolean }>;
  }> {
    console.log('🔍 Checking button states...');
    
    const addButtonState = {
      visible: await this.addNewSongButton.isVisible(),
      enabled: await this.addNewSongButton.isEnabled()
    };
    
    const filterButtonState = {
      visible: await this.filterButton.isVisible(),
      enabled: await this.filterButton.isEnabled()
    };
    
    const cancelButtonState = {
      visible: await this.cancelFilterButton.isVisible(),
      enabled: await this.cancelFilterButton.isEnabled()
    };
    
    const editButtonCount = await this.editButtons.count();
    const editButtonStates = [];
    for (let i = 0; i < editButtonCount; i++) {
      editButtonStates.push({
        visible: await this.editButtons.nth(i).isVisible(),
        enabled: await this.editButtons.nth(i).isEnabled()
      });
    }
    
    const deleteButtonCount = await this.deleteButtons.count();
    const deleteButtonStates = [];
    for (let i = 0; i < deleteButtonCount; i++) {
      deleteButtonStates.push({
        visible: await this.deleteButtons.nth(i).isVisible(),
        enabled: await this.deleteButtons.nth(i).isEnabled()
      });
    }
    
    const saveButtonCount = await this.saveButtons.count();
    const saveButtonStates = [];
    for (let i = 0; i < saveButtonCount; i++) {
      saveButtonStates.push({
        visible: await this.saveButtons.nth(i).isVisible(),
        enabled: await this.saveButtons.nth(i).isEnabled()
      });
    }
    
    const buttonStates = {
      addButton: addButtonState,
      filterButton: filterButtonState,
      cancelButton: cancelButtonState,
      editButtons: editButtonStates,
      deleteButtons: deleteButtonStates,
      saveButtons: saveButtonStates
    };
    
    console.log('📍 Button states:', buttonStates);
    return buttonStates;
  }

  /**
   * Verify image loading status for all elements (visibility-only)
   */
  async verifyImagesLoaded(): Promise<{
    allImagesLoaded: boolean;
    imageCount: number;
    loadedImages: number;
    failedImages: number;
  }> {
    console.log('🔍 Verifying image loading status...');
    
    // Get all image elements
    const images = await this.page.locator('img').all();
    let loadedCount = 0;
    let failedCount = 0;
    
    for (const image of images) {
      try {
        const isLoaded = await image.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalHeight !== 0;
        });
        
        if (isLoaded) {
          loadedCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.log('⚠️ Error checking image:', error);
        failedCount++;
      }
    }
    
    const imageStatus = {
      allImagesLoaded: failedCount === 0,
      imageCount: images.length,
      loadedImages: loadedCount,
      failedImages: failedCount
    };
    
    console.log('📍 Image loading status:', imageStatus);
    return imageStatus;
  }
}