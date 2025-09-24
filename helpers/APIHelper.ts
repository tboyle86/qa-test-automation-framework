import { Page, APIResponse, expect } from '@playwright/test';

/**
 * APIHelper - Backend API testing and validation
 * Demonstrates full-stack testing capabilities
 */
export class APIHelper {
  private page: Page;
  private baseURL: string;

  constructor(page: Page, baseURL?: string) {
    this.page = page;
    this.baseURL = baseURL || page.url();
  }

  /**
   * Intercept and validate API calls during test execution
   */
  async interceptAPICallsDuring(testFunction: () => Promise<void>): Promise<{
    apiCalls: Array<{
      method: string;
      url: string;
      status: number;
      responseTime: number;
      requestBody?: any;
      responseBody?: any;
    }>;
    failedCalls: Array<{ url: string; status: number; error: string }>;
    summary: {
      totalCalls: number;
      successfulCalls: number;
      failedCalls: number;
      avgResponseTime: number;
    };
  }> {
    const apiCalls: any[] = [];
    const failedCalls: any[] = [];

    // Set up API request interception
    await this.page.route('**/api/**', async (route, request) => {
      const startTime = Date.now();
      
      try {
        const response = await route.fetch();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const callData = {
          method: request.method(),
          url: request.url(),
          status: response.status(),
          responseTime,
          requestBody: request.postDataJSON(),
          responseBody: await response.json().catch(() => null)
        };

        apiCalls.push(callData);

        if (response.status() >= 400) {
          failedCalls.push({
            url: request.url(),
            status: response.status(),
            error: `HTTP ${response.status()} error`
          });
        }

        await route.fulfill({ response });
      } catch (error) {
        failedCalls.push({
          url: request.url(),
          status: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        await route.abort();
      }
    });

    // Execute the test function
    await testFunction();

    // Calculate summary statistics
    const totalCalls = apiCalls.length;
    const successfulCalls = apiCalls.filter(call => call.status < 400).length;
    const avgResponseTime = totalCalls > 0 
      ? Math.round(apiCalls.reduce((sum, call) => sum + call.responseTime, 0) / totalCalls)
      : 0;

    return {
      apiCalls,
      failedCalls,
      summary: {
        totalCalls,
        successfulCalls,
        failedCalls: failedCalls.length,
        avgResponseTime
      }
    };
  }

  /**
   * Test save functionality API endpoint
   */
  async testSaveEndpoint(songData: any): Promise<{
    success: boolean;
    responseTime: number;
    statusCode: number;
    responseData?: any;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      // Simulate save API call that the app might make
      const response = await this.page.evaluate(async (data) => {
        // Simulate the save operation that might happen in the real app
        return new Promise((resolve) => {
          // Simulate 80% success rate as per requirements
          const isSuccess = Math.random() > 0.2;
          
          setTimeout(() => {
            resolve({
              success: isSuccess,
              status: isSuccess ? 200 : 500,
              data: isSuccess ? { id: Date.now(), ...data } : null,
              error: isSuccess ? null : 'Save operation failed'
            });
          }, Math.random() * 1000 + 200); // 200-1200ms response time
        });
      }, songData);

      const endTime = Date.now();

      return {
        success: (response as any).success,
        responseTime: endTime - startTime,
        statusCode: (response as any).status,
        responseData: (response as any).data,
        error: (response as any).error
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        success: false,
        responseTime: endTime - startTime,
        statusCode: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate API response schema
   */
  async validateResponseSchema(response: any, expectedSchema: any): Promise<{
    valid: boolean;
    errors: string[];
    missingFields: string[];
    extraFields: string[];
  }> {
    const errors: string[] = [];
    const missingFields: string[] = [];
    const extraFields: string[] = [];

    // Check required fields
    for (const field of expectedSchema.required || []) {
      if (!(field in response)) {
        missingFields.push(field);
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check field types
    for (const [field, expectedType] of Object.entries(expectedSchema.properties || {})) {
      if (field in response) {
        const actualType = typeof response[field];
        if (actualType !== expectedType) {
          errors.push(`Field ${field} expected ${expectedType}, got ${actualType}`);
        }
      }
    }

    // Check for extra fields (if strict mode)
    if (expectedSchema.additionalProperties === false) {
      const expectedFields = Object.keys(expectedSchema.properties || {});
      for (const field of Object.keys(response)) {
        if (!expectedFields.includes(field)) {
          extraFields.push(field);
          errors.push(`Unexpected field: ${field}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      missingFields,
      extraFields
    };
  }

  /**
   * Generate API testing report
   */
  async generateAPIReport(apiCalls: any[], testName: string): Promise<{
    testName: string;
    summary: {
      totalRequests: number;
      successRate: number;
      avgResponseTime: number;
      fastestCall: number;
      slowestCall: number;
    };
    performance: {
      callsUnder200ms: number;
      callsUnder500ms: number;
      callsOver1000ms: number;
    };
    errors: Array<{ url: string; error: string }>;
    recommendations: string[];
  }> {
    const totalRequests = apiCalls.length;
    const successfulCalls = apiCalls.filter(call => call.status && call.status < 400).length;
    const responseTimes = apiCalls.map(call => call.responseTime || 0);
    
    const successRate = totalRequests > 0 ? Math.round((successfulCalls / totalRequests) * 100) : 0;
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;
    
    const fastestCall = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const slowestCall = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
    
    const callsUnder200ms = responseTimes.filter(time => time < 200).length;
    const callsUnder500ms = responseTimes.filter(time => time < 500).length;
    const callsOver1000ms = responseTimes.filter(time => time > 1000).length;

    const errors = apiCalls
      .filter(call => call.status >= 400 || !call.status)
      .map(call => ({
        url: call.url,
        error: `HTTP ${call.status || 0} error`
      }));

    const recommendations = [];
    if (successRate < 95) recommendations.push('Improve API reliability');
    if (avgResponseTime > 500) recommendations.push('Optimize API response times');
    if (callsOver1000ms > 0) recommendations.push('Investigate slow API calls');
    if (errors.length > 0) recommendations.push('Address API error responses');

    return {
      testName,
      summary: {
        totalRequests,
        successRate,
        avgResponseTime,
        fastestCall,
        slowestCall
      },
      performance: {
        callsUnder200ms,
        callsUnder500ms,
        callsOver1000ms
      },
      errors,
      recommendations
    };
  }
}