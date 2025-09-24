# Smart CI/CD Test Execution Strategy
# Configuration for different pipeline triggers and test execution patterns

## 1. Pre-Commit Hook Trigger (Developer Check-in)
# Triggered by: Git pre-commit hook
# Duration: 2-5 minutes
# Purpose: Fast feedback for developers

### Execution Strategy:
- **Always Run**: @smoke tests (critical functionality validation)
- **Conditional Run**: Additional tags based on changed files
  - Files matching "song-library|add-song|edit-song|delete-song" → @crud tests
  - Files matching "filter" → @filtering tests  
  - Files matching "sort" → @sorting tests
  - Files matching "responsive|mobile" → @responsive tests
  - Files matching "pwa|service-worker" → @pwa tests
  - Files matching "performance" → @performance tests
  - Files matching "accessibility" → @accessibility tests

### Jenkins Command:
```bash
# Trigger smart execution pipeline
curl -X POST "http://jenkins-server/job/song-library-tests/buildWithParameters" \
  -d "TEST_SUITE=smart-execution" \
  -d "TRIGGER_TYPE=pre-commit" \
  -d "GENERATE_REPORTS=true"
```

## 2. Post-Merge Hook (Main Branch Integration)
# Triggered by: Merge to main/develop branch
# Duration: 5-10 minutes  
# Purpose: Comprehensive validation after integration

### Execution Strategy:
- **Always Run**: @smoke + @crud tests (core functionality)
- **Browser Coverage**: Chrome + Firefox (primary browsers)
- **Reports**: Unified dashboard + Allure reports

### Jenkins Command:
```bash
curl -X POST "http://jenkins-server/job/song-library-tests/buildWithParameters" \
  -d "TEST_SUITE=chrome-report" \
  -d "TRIGGER_TYPE=post-merge" \
  -d "GENERATE_REPORTS=true"
```

## 3. Scheduled Full Regression (Nightly)
# Triggered by: Jenkins cron schedule
# Duration: 15-20 minutes
# Purpose: Complete application validation
# Schedule: Every night at 2 AM (off-hours)

### Execution Strategy:
- **Complete Test Suite**: All 456 tests across 6 browsers
- **Full Coverage**: All test categories and tags
- **Comprehensive Reports**: Both reporting systems with trends

### Jenkins Cron Configuration:
```groovy
triggers {
    cron('0 2 * * *') // Daily at 2 AM
}
```

### Jenkins Command:
```bash
curl -X POST "http://jenkins-server/job/song-library-tests/buildWithParameters" \
  -d "TEST_SUITE=full-report" \
  -d "TRIGGER_TYPE=scheduled" \
  -d "GENERATE_REPORTS=true" \
  -d "BROWSER_COUNT=6"
```

## 4. Feature Branch Validation (Pull Request)
# Triggered by: Pull request creation/update
# Duration: 8-12 minutes
# Purpose: Feature validation before merge

### Execution Strategy:
- **Smoke Tests**: @smoke (critical paths)
- **Feature-Specific**: Tags based on PR file changes
- **Cross-Browser**: Chrome + Safari (desktop + mobile)
- **Quality Gates**: 95% pass rate required

### Jenkins Command:
```bash
curl -X POST "http://jenkins-server/job/song-library-tests/buildWithParameters" \
  -d "TEST_SUITE=smart-execution" \
  -d "TRIGGER_TYPE=pull-request" \
  -d "TAGS_TO_RUN=@smoke|@{feature-tags}" \
  -d "GENERATE_REPORTS=true"
```

## 5. Hotfix Validation (Emergency Fixes)
# Triggered by: Hotfix branch deployment
# Duration: 3-5 minutes
# Purpose: Critical functionality validation

### Execution Strategy:
- **Smoke Tests Only**: @smoke (fastest validation)
- **Single Browser**: Chrome (quickest execution)
- **Immediate Feedback**: Fast pass/fail determination

### Jenkins Command:
```bash
curl -X POST "http://jenkins-server/job/song-library-tests/buildWithParameters" \
  -d "TEST_SUITE=smoke-only" \
  -d "TRIGGER_TYPE=hotfix" \
  -d "GENERATE_REPORTS=false"
```

## File-to-Tag Mapping Reference

| File Pattern | Test Tags | Rationale |
|--------------|-----------|-----------|
| `song-library` | `@crud @smoke` | Core CRUD operations |
| `add-song` | `@crud` | Song creation functionality |
| `edit-song` | `@crud` | Song modification functionality |
| `delete-song` | `@crud` | Song deletion functionality |
| `filter` | `@filtering` | Search and filter operations |
| `sort` | `@sorting` | Sorting and ordering functionality |
| `responsive` | `@responsive` | Responsive design and mobile |
| `mobile` | `@responsive @mobile` | Mobile-specific functionality |
| `pwa` | `@pwa` | Progressive Web App features |
| `service-worker` | `@pwa` | PWA service worker functionality |
| `performance` | `@performance` | Performance optimizations |
| `accessibility` | `@accessibility` | Accessibility improvements |

## Test Execution Time Estimates

| Test Suite | Duration | Test Count | Browser Coverage |
|------------|----------|------------|------------------|
| **@smoke** | 2-3 min | ~15 tests | Chrome only |
| **@smoke + @crud** | 4-6 min | ~35 tests | Chrome only |
| **Chrome Report** | 8-12 min | 76 tests | Chrome only |
| **Cross-Browser** | 12-18 min | 152 tests | Chrome + Firefox |
| **Full Regression** | 15-25 min | 456 tests | All 6 browsers |

## Quality Gates and Thresholds

### Pre-Commit (Fast Feedback)
- **Pass Rate**: ≥ 90%
- **Max Duration**: 5 minutes
- **Failure Action**: Block commit (optional)

### Post-Merge (Integration Validation)
- **Pass Rate**: ≥ 95%
- **Max Duration**: 10 minutes  
- **Failure Action**: Immediate notification

### Nightly Regression (Comprehensive)
- **Pass Rate**: ≥ 98%
- **Max Duration**: 30 minutes
- **Failure Action**: Daily report with trends

## Notification Strategy

### Success Notifications
- **Pre-Commit**: Console output only
- **Post-Merge**: Slack/Teams notification
- **Nightly**: Email digest with metrics

### Failure Notifications
- **Pre-Commit**: Console + optional email
- **Post-Merge**: Immediate Slack/Teams alert
- **Nightly**: Detailed email with failure analysis

This strategy provides **fast developer feedback** while ensuring **comprehensive quality coverage** through scheduled regression testing.