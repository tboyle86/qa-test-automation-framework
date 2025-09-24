/**
 * PWA Testing Helper Class
 * Provides Progressive Web App specific testing functionality
 */
class PWAHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Check if service worker is registered
   * @returns {Promise<boolean>} True if service worker is registered
   */
  async isServiceWorkerRegistered() {
    const registration = await this.page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          return !!registration;
        } catch (error) {
          return false;
        }
      }
      return false;
    });
    
    return registration;
  }

  /**
   * Get service worker registration details
   * @returns {Promise<Object>} Service worker details
   */
  async getServiceWorkerDetails() {
    const details = await this.page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          return {
            scope: registration.scope,
            updateViaCache: registration.updateViaCache,
            active: !!registration.active,
            installing: !!registration.installing,
            waiting: !!registration.waiting,
            scriptURL: registration.active ? registration.active.scriptURL : null,
            state: registration.active ? registration.active.state : null
          };
        } catch (error) {
          return { error: error.message };
        }
      }
      return { error: 'Service Worker not supported' };
    });
    
    return details;
  }

  /**
   * Test offline functionality
   * @param {Array} testScenarios - Array of offline test scenarios
   */
  async testOfflineFunctionality(testScenarios) {
    const results = [];
    
    for (const scenario of testScenarios) {
      // Go offline
      await this.page.context().setOffline(true);
      
      try {
        // Perform scenario actions
        if (scenario.action) {
          await scenario.action(this.page);
        }
        
        // Check expected behavior
        const result = await scenario.verify(this.page);
        
        results.push({
          scenario: scenario.name,
          status: result ? 'pass' : 'fail',
          message: scenario.description
        });
        
      } catch (error) {
        results.push({
          scenario: scenario.name,
          status: 'fail',
          error: error.message
        });
      }
      
      // Go back online
      await this.page.context().setOffline(false);
      await this.page.waitForLoadState('networkidle');
    }
    
    return results;
  }

  /**
   * Test PWA installation
   * @returns {Promise<Object>} Installation test results
   */
  async testInstallation() {
    const installationData = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        let installPromptEvent = null;
        let isInstallable = false;
        
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          installPromptEvent = e;
          isInstallable = true;
          resolve({
            isInstallable: true,
            canPrompt: true,
            platforms: e.platforms || []
          });
        });
        
        // Check if already installed
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          resolve({
            isInstallable: false,
            isInstalled: true,
            displayMode: 'standalone'
          });
        }
        
        // Timeout if no install prompt
        setTimeout(() => {
          resolve({
            isInstallable: false,
            canPrompt: false,
            reason: 'No install prompt triggered'
          });
        }, 5000);
      });
    });
    
    return installationData;
  }

  /**
   * Check manifest file
   * @returns {Promise<Object>} Manifest validation results
   */
  async validateManifest() {
    const manifestData = await this.page.evaluate(async () => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      
      if (!manifestLink) {
        return { error: 'No manifest link found' };
      }
      
      try {
        const response = await fetch(manifestLink.href);
        const manifest = await response.json();
        
        return {
          exists: true,
          url: manifestLink.href,
          manifest: manifest,
          validation: {
            hasName: !!(manifest.name || manifest.short_name),
            hasIcons: !!(manifest.icons && manifest.icons.length > 0),
            hasStartUrl: !!manifest.start_url,
            hasDisplay: !!manifest.display,
            hasThemeColor: !!manifest.theme_color,
            hasBackgroundColor: !!manifest.background_color
          }
        };
      } catch (error) {
        return { 
          exists: true,
          url: manifestLink.href,
          error: `Failed to fetch or parse manifest: ${error.message}` 
        };
      }
    });
    
    return manifestData;
  }

  /**
   * Test cache strategies
   * @returns {Promise<Object>} Cache strategy test results
   */
  async testCacheStrategies() {
    const cacheData = await this.page.evaluate(async () => {
      if (!('caches' in window)) {
        return { error: 'Cache API not supported' };
      }
      
      try {
        const cacheNames = await caches.keys();
        const cacheDetails = [];
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          cacheDetails.push({
            name: cacheName,
            requestCount: requests.length,
            requests: requests.map(req => ({
              url: req.url,
              method: req.method
            }))
          });
        }
        
        return {
          cacheCount: cacheNames.length,
          caches: cacheDetails
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    return cacheData;
  }

  /**
   * Test background sync (if supported)
   * @returns {Promise<Object>} Background sync test results
   */
  async testBackgroundSync() {
    const syncData = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('background-sync-test');
          }).then(() => {
            resolve({
              supported: true,
              registered: true
            });
          }).catch(error => {
            resolve({
              supported: true,
              registered: false,
              error: error.message
            });
          });
        } else {
          resolve({
            supported: false,
            reason: 'Background Sync not supported'
          });
        }
      });
    });
    
    return syncData;
  }

  /**
   * Test push notifications (basic check)
   * @returns {Promise<Object>} Push notification capability
   */
  async testPushNotifications() {
    const pushData = await this.page.evaluate(() => {
      return {
        supported: 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window,
        permission: Notification.permission,
        requiresUserGesture: true // Most browsers require user gesture for permission
      };
    });
    
    return pushData;
  }

  /**
   * Check PWA display mode
   * @returns {Promise<string>} Current display mode
   */
  async getDisplayMode() {
    const displayMode = await this.page.evaluate(() => {
      if (window.matchMedia) {
        const modes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
        
        for (const mode of modes) {
          if (window.matchMedia(`(display-mode: ${mode})`).matches) {
            return mode;
          }
        }
      }
      
      return 'browser';
    });
    
    return displayMode;
  }

  /**
   * Test PWA update mechanism
   * @returns {Promise<Object>} Update mechanism test results
   */
  async testUpdateMechanism() {
    const updateData = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            resolve({
              updateDetected: true,
              timestamp: new Date().toISOString()
            });
          });
          
          navigator.serviceWorker.ready.then(registration => {
            // Check for updates
            registration.update().then(() => {
              setTimeout(() => {
                resolve({
                  updateChecked: true,
                  updateDetected: false
                });
              }, 2000);
            });
          });
        } else {
          resolve({
            error: 'Service Worker not supported'
          });
        }
      });
    });
    
    return updateData;
  }

  /**
   * Validate PWA criteria
   * @returns {Promise<Object>} PWA validation results
   */
  async validatePWACriteria() {
    const [
      serviceWorker,
      manifest,
      displayMode,
      cacheData,
      isHttps
    ] = await Promise.all([
      this.getServiceWorkerDetails(),
      this.validateManifest(),
      this.getDisplayMode(),
      this.testCacheStrategies(),
      this.page.evaluate(() => location.protocol === 'https:')
    ]);
    
    const criteria = {
      servedOverHttps: isHttps,
      hasServiceWorker: !serviceWorker.error && serviceWorker.active,
      hasManifest: !manifest.error && manifest.exists,
      manifestValid: manifest.validation && Object.values(manifest.validation).every(v => v),
      isInstallable: displayMode === 'standalone' || await this.testInstallation().then(r => r.isInstallable),
      hasOfflineSupport: !cacheData.error && cacheData.cacheCount > 0,
      isResponsive: true // Would need additional viewport testing
    };
    
    const score = Object.values(criteria).filter(Boolean).length / Object.keys(criteria).length * 100;
    
    return {
      score: Math.round(score),
      criteria,
      details: {
        serviceWorker,
        manifest,
        displayMode,
        cacheData
      }
    };
  }

  /**
   * Generate PWA testing report
   * @param {Object} testResults - PWA test results
   */
  generatePWAReport(testResults) {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      pwaValidation: testResults.validation,
      offlineTests: testResults.offline || [],
      installationTest: testResults.installation || {},
      cacheTests: testResults.cache || {},
      summary: {
        overallScore: testResults.validation ? testResults.validation.score : 0,
        criteriaMet: testResults.validation ? Object.values(testResults.validation.criteria).filter(Boolean).length : 0,
        totalCriteria: testResults.validation ? Object.keys(testResults.validation.criteria).length : 0
      },
      recommendations: this.generatePWARecommendations(testResults)
    };
    
    return report;
  }

  /**
   * Generate PWA recommendations
   * @param {Object} testResults - PWA test results
   */
  generatePWARecommendations(testResults) {
    const recommendations = [];
    
    if (testResults.validation) {
      const criteria = testResults.validation.criteria;
      
      if (!criteria.servedOverHttps) {
        recommendations.push('Serve application over HTTPS for PWA functionality');
      }
      
      if (!criteria.hasServiceWorker) {
        recommendations.push('Implement and register a service worker');
      }
      
      if (!criteria.hasManifest) {
        recommendations.push('Add a valid web app manifest file');
      }
      
      if (!criteria.manifestValid) {
        recommendations.push('Ensure manifest file includes all required fields');
      }
      
      if (!criteria.hasOfflineSupport) {
        recommendations.push('Implement offline support through service worker caching');
      }
      
      if (!criteria.isInstallable) {
        recommendations.push('Ensure app meets installability criteria');
      }
    }
    
    return recommendations;
  }

  /**
   * Save PWA testing report
   * @param {Object} report - PWA testing report
   * @param {string} filename - Output filename
   */
  async saveReport(report, filename = 'pwa-testing-report.json') {
    const fs = require('fs').promises;
    const path = require('path');
    
    const outputDir = 'test-results/pwa';
    await fs.mkdir(outputDir, { recursive: true });
    
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    
    console.log(`PWA testing report saved to: ${filePath}`);
  }
}

module.exports = PWAHelper;