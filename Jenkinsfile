pipeline {
    agent any
    
    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['smart-execution', 'smoke-only', 'full-report', 'chrome-report', 'test:accessibility', 'test:performance', 'test:pwa', 'test:mobile'],
            description: 'Select test suite to execute'
        )
        string(
            name: 'TAGS_TO_RUN',
            defaultValue: '@smoke',
            description: 'Test tags to execute (e.g., "@smoke|@crud")'
        )
        booleanParam(
            name: 'GENERATE_REPORTS',
            defaultValue: true,
            description: 'Generate and publish test reports'
        )
        string(
            name: 'BROWSER_COUNT',
            defaultValue: '6',
            description: 'Number of browsers for parallel execution'
        )
        choice(
            name: 'TRIGGER_TYPE',
            choices: ['manual', 'pre-commit', 'scheduled', 'post-merge'],
            description: 'Pipeline trigger type'
        )
    }
    
    environment {
        NODE_VERSION = '18'
        JAVA_HOME = '/usr/lib/jvm/java-11-openjdk'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/browsers"
        ALLURE_RESULTS = "${WORKSPACE}/test-results/allure-results"
        UNIFIED_REPORTS = "${WORKSPACE}/test-results/unified-reports"
        COVERAGE_REPORTS = "${WORKSPACE}/test-results/coverage"
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        retry(1)
        timestamps()
    }
    
    stages {
        stage('Environment Setup') {
            steps {
                script {
                    echo "🚀 Starting QA Test Automation Pipeline"
                    echo "Test Suite: ${params.TEST_SUITE}"
                    echo "Generate Reports: ${params.GENERATE_REPORTS}"
                    echo "Browser Count: ${params.BROWSER_COUNT}"
                }
                
                // Clean workspace
                cleanWs()
                
                // Checkout code
                checkout scm
                
                // Setup Node.js
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Dependencies Installation') {
            steps {
                echo "📦 Installing dependencies..."
                
                // Install Node dependencies
                sh 'npm ci --silent'
                
                // Install Playwright browsers
                sh 'npx playwright install --with-deps'
                
                // Verify installations
                sh '''
                    echo "✅ Dependency verification:"
                    npx playwright --version
                    java --version
                '''
            }
        }
        
        stage('Pre-Test Validation') {
            parallel {
                stage('Code Quality') {
                    steps {
                        echo "🔍 Running code quality checks..."
                        sh '''
                            echo "TypeScript compilation check..."
                            npx tsc --noEmit
                            
                            echo "ESLint validation..."
                            npx eslint . --ext .ts --format json > eslint-report.json || true
                        '''
                    }
                }
                
                stage('Security Scan') {
                    steps {
                        echo "🔒 Running security audit..."
                        sh '''
                            npm audit --audit-level=high --json > security-audit.json || true
                            echo "Security audit completed"
                        '''
                    }
                }
                
                stage('Application Health Check') {
                    steps {
                        echo "🏥 Validating application accessibility..."
                        sh '''
                            curl -f -s -o /dev/null https://shuxincolorado.github.io/song-list2/dist/song-list2/ || {
                                echo "❌ Application not accessible"
                                exit 1
                            }
                            echo "✅ Application is accessible"
                        '''
                    }
                }
            }
        }
        
        stage('Smart Test Execution') {
            steps {
                script {
                    echo "🧪 Executing test suite: ${params.TEST_SUITE}"
                    echo "🎯 Test tags: ${params.TAGS_TO_RUN}"
                    echo "🚀 Trigger type: ${params.TRIGGER_TYPE}"
                    
                    def testCommand = ""
                    
                    // Determine test execution strategy
                    switch(params.TEST_SUITE) {
                        case 'smart-execution':
                            // Read Jenkins trigger file if available from Git hook
                            if (fileExists('.jenkins-trigger')) {
                                def triggerConfig = readFile('.jenkins-trigger')
                                echo "📋 Git hook configuration detected:"
                                echo triggerConfig
                                
                                // Extract tags from trigger file
                                def tagMatch = triggerConfig =~ /TAGS_TO_RUN=(.+)/
                                if (tagMatch) {
                                    def tagsFromHook = tagMatch[0][1]
                                    echo "🎯 Using tags from Git hook: ${tagsFromHook}"
                                    testCommand = "npx playwright test --grep \"${tagsFromHook}\" --project=chromium"
                                } else {
                                    testCommand = "npx playwright test --grep \"${params.TAGS_TO_RUN}\" --project=chromium"
                                }
                            } else {
                                testCommand = "npx playwright test --grep \"${params.TAGS_TO_RUN}\" --project=chromium"
                            }
                            break
                            
                        case 'smoke-only':
                            testCommand = "npx playwright test --grep \"@smoke\" --project=chromium"
                            break
                            
                        case 'full-report':
                            testCommand = "npm run full-report"
                            break
                            
                        case 'chrome-report':
                            testCommand = "npm run chrome-report"
                            break
                            
                        default:
                            testCommand = "npm run ${params.TEST_SUITE}"
                    }
                    
                    echo "🔧 Executing command: ${testCommand}"
                    
                    try {
                        // Execute determined test command
                        sh testCommand
                        
                        // Mark build as successful if tests pass
                        currentBuild.result = 'SUCCESS'
                        
                    } catch (Exception e) {
                        echo "⚠️ Tests completed with failures: ${e.getMessage()}"
                        
                        // Continue to report generation even if tests fail
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
            
            post {
                always {
                    // Archive test artifacts regardless of test outcome
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    
                    // Capture screenshots and videos for failed tests
                    archiveArtifacts artifacts: 'test-results/**/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/videos/**', allowEmptyArchive: true
                }
            }
        }
        
        stage('Report Generation') {
            when {
                expression { params.GENERATE_REPORTS == true }
            }
            
            parallel {
                stage('Allure Reports') {
                    steps {
                        echo "📊 Generating Allure reports..."
                        
                        script {
                            try {
                                sh '''
                                    npx allure generate ${ALLURE_RESULTS} -o ${WORKSPACE}/allure-report --clean
                                    echo "✅ Allure report generated successfully"
                                '''
                            } catch (Exception e) {
                                echo "⚠️ Allure report generation failed: ${e.getMessage()}"
                            }
                        }
                    }
                }
                
                stage('Unified Dashboard') {
                    steps {
                        echo "📈 Generating unified dashboard..."
                        
                        script {
                            try {
                                sh '''
                                    npx ts-node helpers/UnifiedReportGenerator.ts
                                    echo "✅ Unified dashboard generated successfully"
                                '''
                            } catch (Exception e) {
                                echo "⚠️ Unified dashboard generation failed: ${e.getMessage()}"
                            }
                        }
                    }
                }
                
                stage('Coverage Analysis') {
                    steps {
                        echo "📋 Processing coverage data..."
                        
                        sh '''
                            if [ -d "${COVERAGE_REPORTS}" ]; then
                                echo "✅ Coverage reports found"
                                ls -la ${COVERAGE_REPORTS}/
                            else
                                echo "ℹ️ No coverage data available"
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Quality Gates') {
            steps {
                script {
                    echo "🚦 Evaluating quality gates..."
                    
                    def testResults = [:]
                    def qualityGatesPassed = true
                    
                    // Read test results if available
                    if (fileExists('test-results/json/results.json')) {
                        def results = readJSON file: 'test-results/json/results.json'
                        
                        testResults.total = results.stats?.total ?: 0
                        testResults.passed = results.stats?.expected ?: 0
                        testResults.failed = results.stats?.unexpected ?: 0
                        testResults.flaky = results.stats?.flaky ?: 0
                        
                        def passRate = testResults.total > 0 ? (testResults.passed / testResults.total) * 100 : 0
                        
                        echo "📊 Test Results Summary:"
                        echo "   Total Tests: ${testResults.total}"
                        echo "   Passed: ${testResults.passed}"
                        echo "   Failed: ${testResults.failed}"
                        echo "   Flaky: ${testResults.flaky}"
                        echo "   Pass Rate: ${passRate.round(2)}%"
                        
                        // Quality gate thresholds
                        if (passRate < 80) {
                            qualityGatesPassed = false
                            echo "❌ Quality Gate FAILED: Pass rate ${passRate.round(2)}% below threshold (80%)"
                        }
                        
                        if (testResults.flaky > (testResults.total * 0.05)) {
                            qualityGatesPassed = false  
                            echo "❌ Quality Gate FAILED: Flaky test rate too high"
                        }
                        
                    } else {
                        echo "ℹ️ No test results JSON found for quality gate evaluation"
                    }
                    
                    if (qualityGatesPassed) {
                        echo "✅ All quality gates passed"
                    } else {
                        currentBuild.result = 'UNSTABLE'
                        echo "⚠️ Some quality gates failed - build marked as unstable"
                    }
                }
            }
        }
        
        stage('Publish Results') {
            steps {
                script {
                    echo "📤 Publishing test results and reports..."
                    
                    // Publish test results
                    if (fileExists('test-results/json/results.json')) {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'test-results/unified-reports',
                            reportFiles: 'latest.html',
                            reportName: 'Unified Test Dashboard',
                            reportTitles: 'Interactive Test Metrics'
                        ])
                        
                        echo "✅ Unified dashboard published"
                    }
                    
                    // Publish Allure reports
                    if (fileExists('allure-report/index.html')) {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'allure-report',
                            reportFiles: 'index.html',
                            reportName: 'Allure Test Report',
                            reportTitles: 'Professional Test Analysis'
                        ])
                        
                        echo "✅ Allure report published"
                    }
                    
                    // Publish coverage reports if available
                    if (fileExists('test-results/coverage/index.html')) {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'test-results/coverage',
                            reportFiles: 'index.html',
                            reportName: 'Code Coverage Report',
                            reportTitles: 'Application Coverage Analysis'
                        ])
                        
                        echo "✅ Coverage report published"
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🧹 Cleaning up workspace..."
                
                // Archive important artifacts
                archiveArtifacts artifacts: 'test-results/**/*.json', allowEmptyArchive: true
                archiveArtifacts artifacts: 'eslint-report.json', allowEmptyArchive: true
                archiveArtifacts artifacts: 'security-audit.json', allowEmptyArchive: true
                
                // Clean up large directories to save space
                sh '''
                    rm -rf node_modules || true
                    rm -rf ${PLAYWRIGHT_BROWSERS_PATH} || true
                '''
            }
        }
        
        success {
            script {
                echo "🎉 Pipeline completed successfully!"
                
                // Send success notification
                emailext (
                    subject: "✅ QA Tests PASSED - Build #${BUILD_NUMBER}",
                    body: """
                        <h2>🎉 Test Automation Pipeline - SUCCESS</h2>
                        
                        <h3>📊 Build Information:</h3>
                        <ul>
                            <li><strong>Build Number:</strong> ${BUILD_NUMBER}</li>
                            <li><strong>Test Suite:</strong> ${params.TEST_SUITE}</li>
                            <li><strong>Duration:</strong> ${currentBuild.durationString}</li>
                            <li><strong>Timestamp:</strong> ${new Date()}</li>
                        </ul>
                        
                        <h3>📈 Quick Links:</h3>
                        <ul>
                            <li><a href="${BUILD_URL}">Jenkins Build</a></li>
                            <li><a href="${BUILD_URL}Unified_Test_Dashboard/">Unified Dashboard</a></li>
                            <li><a href="${BUILD_URL}Allure_Test_Report/">Allure Reports</a></li>
                        </ul>
                        
                        <p><em>All tests executed successfully. Quality gates passed.</em></p>
                    """,
                    mimeType: 'text/html',
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                
                // Send failure notification
                emailext (
                    subject: "❌ QA Tests FAILED - Build #${BUILD_NUMBER}",
                    body: """
                        <h2>❌ Test Automation Pipeline - FAILURE</h2>
                        
                        <h3>📊 Build Information:</h3>
                        <ul>
                            <li><strong>Build Number:</strong> ${BUILD_NUMBER}</li>
                            <li><strong>Test Suite:</strong> ${params.TEST_SUITE}</li>
                            <li><strong>Duration:</strong> ${currentBuild.durationString}</li>
                            <li><strong>Failure Stage:</strong> ${env.FAILED_STAGE ?: 'Unknown'}</li>
                        </ul>
                        
                        <h3>🔗 Investigation Links:</h3>
                        <ul>
                            <li><a href="${BUILD_URL}">Jenkins Build Logs</a></li>
                            <li><a href="${BUILD_URL}console">Console Output</a></li>
                            <li><a href="${BUILD_URL}artifact/">Build Artifacts</a></li>
                        </ul>
                        
                        <p><em>Please investigate the failure and take appropriate action.</em></p>
                    """,
                    mimeType: 'text/html',
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline completed with warnings (unstable)"
                
                // Send unstable notification
                emailext (
                    subject: "⚠️ QA Tests UNSTABLE - Build #${BUILD_NUMBER}",
                    body: """
                        <h2>⚠️ Test Automation Pipeline - UNSTABLE</h2>
                        
                        <h3>📊 Build Information:</h3>
                        <ul>
                            <li><strong>Build Number:</strong> ${BUILD_NUMBER}</li>
                            <li><strong>Test Suite:</strong> ${params.TEST_SUITE}</li>
                            <li><strong>Duration:</strong> ${currentBuild.durationString}</li>
                        </ul>
                        
                        <h3>⚠️ Possible Issues:</h3>
                        <ul>
                            <li>Some tests failed but execution continued</li>
                            <li>Quality gates may have failed</li>
                            <li>Mobile tests may have encountered platform-specific issues</li>
                        </ul>
                        
                        <h3>📈 Review Links:</h3>
                        <ul>
                            <li><a href="${BUILD_URL}">Jenkins Build</a></li>
                            <li><a href="${BUILD_URL}Unified_Test_Dashboard/">Unified Dashboard</a></li>
                            <li><a href="${BUILD_URL}Allure_Test_Report/">Allure Reports</a></li>
                        </ul>
                        
                        <p><em>Please review the test results and address any failing tests.</em></p>
                    """,
                    mimeType: 'text/html',
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
    }
}