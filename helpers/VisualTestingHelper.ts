/**
 * Visual Testing Helper Class
 * Provides visual regression testing functionality
 */
class VisualTestingHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Take full page screenshot
   * @param {string} name - Screenshot name
   * @param {Object} options - Screenshot options
   */
  async takeFullPageScreenshot(name, options = {}) {
    const defaultOptions = {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    await this.page.screenshot({
      path: `test-results/visual/${name}.png`,
      ...mergedOptions
    });
  }

  /**
   * Take element screenshot
   * @param {string} selector - Element selector
   * @param {string} name - Screenshot name
   * @param {Object} options - Screenshot options
   */
  async takeElementScreenshot(selector, name, options = {}) {
    const defaultOptions = {
      animations: 'disabled',
      caret: 'hide'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    await this.page.locator(selector).screenshot({
      path: `test-results/visual/${name}.png`,
      ...mergedOptions
    });
  }

  /**
   * Compare full page with baseline
   * @param {string} name - Test name
   * @param {Object} options - Comparison options
   */
  async compareFullPage(name, options = {}) {
    const defaultOptions = {
      threshold: 0.2,
      maxDiffPixels: 100,
      animations: 'disabled',
      caret: 'hide'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    await expect(this.page).toHaveScreenshot(`${name}.png`, mergedOptions);
  }

  /**
   * Compare element with baseline
   * @param {string} selector - Element selector
   * @param {string} name - Test name
   * @param {Object} options - Comparison options
   */
  async compareElement(selector, name, options = {}) {
    const defaultOptions = {
      threshold: 0.2,
      maxDiffPixels: 50,
      animations: 'disabled',
      caret: 'hide'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    await expect(this.page.locator(selector)).toHaveScreenshot(`${name}.png`, mergedOptions);
  }

  /**
   * Test responsive design across multiple viewports
   * @param {Array} viewports - Array of viewport configurations
   * @param {string} testName - Base test name
   */
  async testResponsiveDesign(viewports, testName) {
    const results = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForLoadState('networkidle');
      
      const screenshotName = `${testName}-${viewport.width}x${viewport.height}`;
      
      try {
        await this.compareFullPage(screenshotName);
        results.push({
          viewport,
          status: 'pass',
          message: 'Visual comparison passed'
        });
      } catch (error) {
        results.push({
          viewport,
          status: 'fail',
          message: error.message,
          error
        });
      }
    }

    return results;
  }

  /**
   * Test component states
   * @param {Object} component - Component configuration
   * @param {Array} states - Array of state configurations
   */
  async testComponentStates(component, states) {
    const results = [];

    for (const state of states) {
      // Apply state
      if (state.action) {
        await state.action(this.page);
      }
      
      // Wait for state to be applied
      if (state.waitFor) {
        await this.page.waitForSelector(state.waitFor, { state: 'visible' });
      }
      
      const screenshotName = `${component.name}-${state.name}`;
      
      try {
        if (component.selector) {
          await this.compareElement(component.selector, screenshotName);
        } else {
          await this.compareFullPage(screenshotName);
        }
        
        results.push({
          component: component.name,
          state: state.name,
          status: 'pass'
        });
      } catch (error) {
        results.push({
          component: component.name,
          state: state.name,
          status: 'fail',
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Test cross-browser visual consistency
   * @param {Array} browsers - Array of browser configurations
   * @param {string} testName - Test name
   */
  async testCrossBrowserConsistency(browsers, testName) {
    // This would typically be implemented as part of the test configuration
    // where the same test runs across multiple browser projects
    const results = [];
    
    for (const browser of browsers) {
      results.push({
        browser: browser.name,
        testName,
        // Browser-specific testing would be handled by Playwright projects
        note: 'Cross-browser testing handled by Playwright projects configuration'
      });
    }
    
    return results;
  }

  /**
   * Test hover states
   * @param {Array} elements - Array of element selectors to test hover
   * @param {string} testName - Base test name
   */
  async testHoverStates(elements, testName) {
    const results = [];

    for (const element of elements) {
      // Take screenshot of normal state
      await this.compareElement(element, `${testName}-${element.replace(/[^a-zA-Z0-9]/g, '_')}-normal`);
      
      // Hover over element
      await this.page.hover(element);
      await this.page.waitForTimeout(500); // Wait for hover animation
      
      // Take screenshot of hover state
      try {
        await this.compareElement(element, `${testName}-${element.replace(/[^a-zA-Z0-9]/g, '_')}-hover`);
        results.push({
          element,
          state: 'hover',
          status: 'pass'
        });
      } catch (error) {
        results.push({
          element,
          state: 'hover',
          status: 'fail',
          error: error.message
        });
      }
      
      // Remove hover
      await this.page.mouse.move(0, 0);
      await this.page.waitForTimeout(500);
    }

    return results;
  }

  /**
   * Test focus states
   * @param {Array} elements - Array of focusable element selectors
   * @param {string} testName - Base test name
   */
  async testFocusStates(elements, testName) {
    const results = [];

    for (const element of elements) {
      // Focus on element
      await this.page.focus(element);
      await this.page.waitForTimeout(200);
      
      try {
        await this.compareElement(element, `${testName}-${element.replace(/[^a-zA-Z0-9]/g, '_')}-focus`);
        results.push({
          element,
          state: 'focus',
          status: 'pass'
        });
      } catch (error) {
        results.push({
          element,
          state: 'focus',
          status: 'fail',
          error: error.message
        });
      }
      
      // Remove focus
      await this.page.evaluate(() => document.activeElement.blur());
    }

    return results;
  }

  /**
   * Test form validation states
   * @param {Object} form - Form configuration
   * @param {Array} validationScenarios - Array of validation scenarios
   */
  async testFormValidationStates(form, validationScenarios) {
    const results = [];

    for (const scenario of validationScenarios) {
      // Fill form according to scenario
      if (scenario.fillData) {
        for (const [field, value] of Object.entries(scenario.fillData)) {
          await this.page.fill(form.fields[field], value);
        }
      }
      
      // Trigger validation
      if (scenario.trigger) {
        await scenario.trigger(this.page);
      }
      
      // Wait for validation state
      await this.page.waitForTimeout(500);
      
      const screenshotName = `${form.name}-validation-${scenario.name}`;
      
      try {
        if (form.selector) {
          await this.compareElement(form.selector, screenshotName);
        } else {
          await this.compareFullPage(screenshotName);
        }
        
        results.push({
          form: form.name,
          scenario: scenario.name,
          status: 'pass'
        });
      } catch (error) {
        results.push({
          form: form.name,
          scenario: scenario.name,
          status: 'fail',
          error: error.message
        });
      }
      
      // Reset form if needed
      if (scenario.reset) {
        await scenario.reset(this.page);
      }
    }

    return results;
  }

  /**
   * Test loading states
   * @param {Array} loadingElements - Array of loading element configurations
   * @param {string} testName - Base test name
   */
  async testLoadingStates(loadingElements, testName) {
    const results = [];

    for (const loadingElement of loadingElements) {
      // Trigger loading state
      if (loadingElement.trigger) {
        await loadingElement.trigger(this.page);
      }
      
      // Wait for loading element to appear
      try {
        await this.page.waitForSelector(loadingElement.selector, { state: 'visible', timeout: 5000 });
        
        const screenshotName = `${testName}-loading-${loadingElement.name}`;
        await this.compareElement(loadingElement.selector, screenshotName);
        
        results.push({
          element: loadingElement.name,
          state: 'loading',
          status: 'pass'
        });
      } catch (error) {
        results.push({
          element: loadingElement.name,
          state: 'loading',
          status: 'fail',
          error: error.message
        });
      }
      
      // Wait for loading to complete
      if (loadingElement.waitForComplete) {
        await this.page.waitForSelector(loadingElement.selector, { state: 'hidden', timeout: 30000 });
      }
    }

    return results;
  }

  /**
   * Generate visual testing report
   * @param {Array} testResults - Array of visual test results
   */
  generateVisualReport(testResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: testResults.length,
        passed: testResults.filter(r => r.status === 'pass').length,
        failed: testResults.filter(r => r.status === 'fail').length
      },
      results: testResults,
      recommendations: this.generateVisualRecommendations(testResults)
    };

    return report;
  }

  /**
   * Generate visual testing recommendations
   * @param {Array} testResults - Test results
   */
  generateVisualRecommendations(testResults) {
    const recommendations = [];
    
    const failedTests = testResults.filter(r => r.status === 'fail');
    
    if (failedTests.length > 0) {
      recommendations.push(`${failedTests.length} visual tests failed. Review and update baselines if changes are intentional.`);
    }
    
    // Check for specific types of failures
    const responsiveFailures = failedTests.filter(r => r.viewport);
    if (responsiveFailures.length > 0) {
      recommendations.push('Responsive design issues detected. Review layout at different viewport sizes.');
    }
    
    const hoverFailures = failedTests.filter(r => r.state === 'hover');
    if (hoverFailures.length > 0) {
      recommendations.push('Hover state inconsistencies found. Review interactive element styling.');
    }
    
    const focusFailures = failedTests.filter(r => r.state === 'focus');
    if (focusFailures.length > 0) {
      recommendations.push('Focus state issues detected. Ensure proper focus indicators for accessibility.');
    }
    
    return recommendations;
  }

  /**
   * Save visual testing report
   * @param {Object} report - Visual testing report
   * @param {string} filename - Output filename
   */
  async saveReport(report, filename = 'visual-testing-report.json') {
    const fs = require('fs').promises;
    const path = require('path');
    
    const outputDir = 'test-results/visual';
    await fs.mkdir(outputDir, { recursive: true });
    
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    
    console.log(`Visual testing report saved to: ${filePath}`);
  }
}

module.exports = VisualTestingHelper;