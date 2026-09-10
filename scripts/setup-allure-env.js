/**
 * Script: setup-allure-env.js
 * Injects environment properties and failure categories into allure-results
 * prior to generating the HTML Allure report.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    const commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return { branch: branch || 'unknown', commit: commit || 'unknown' };
  } catch {
    return {
      branch: process.env.GITHUB_REF_NAME || process.env.BUILD_SOURCEBRANCHNAME || 'local-workspace',
      commit: process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : 'head',
    };
  }
}

function detectCiProvider() {
  if (process.env.TF_BUILD) return 'Azure DevOps Pipelines';
  if (process.env.GITHUB_ACTIONS) return 'GitHub Actions';
  if (process.env.JENKINS_URL) return 'Jenkins CI';
  if (process.env.GITLAB_CI) return 'GitLab CI';
  return 'Local Developer Machine';
}

function setupAllureMetadata() {
  const resultsDir = path.resolve(__dirname, '../allure-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const git = getGitInfo();
  const ciProvider = detectCiProvider();
  const buildNumber =
    process.env.BUILD_NUMBER ||
    process.env.GITHUB_RUN_NUMBER ||
    process.env.BUILD_BUILDID ||
    'Local-Run-' + Date.now();

  const testEnv = process.env.TEST_ENV || 'qa';
  const baseUrl =
    process.env.BASE_URL ||
    (testEnv === 'dev'
      ? 'https://apeco-portal-dev.azurecontainerapps.io'
      : testEnv === 'staging'
      ? 'https://apeco-portal-staging.azurecontainerapps.io'
      : 'https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io');

  // 1. Generate environment.properties
  const envProps = [
    `Environment=${testEnv.toUpperCase()}`,
    `Base_URL=${baseUrl}`,
    `CI_Provider=${ciProvider}`,
    `Build_Number=${buildNumber}`,
    `Git_Branch=${git.branch}`,
    `Git_Commit=${git.commit}`,
    `Execution_Date=${new Date().toISOString()}`,
    `Node_Version=${process.version}`,
    `OS_Platform=${os.platform()} (${os.type()} ${os.release()})`,
    `OS_Architecture=${os.arch()}`,
    `Test_Framework=Playwright Test`,
  ].join('\n');

  const envFilePath = path.join(resultsDir, 'environment.properties');
  fs.writeFileSync(envFilePath, envProps, 'utf-8');
  console.log(`[Allure Setup] Generated environment properties at: ${envFilePath}`);

  // 2. Copy categories.json into allure-results
  const sourceCat = path.resolve(__dirname, '../config/categories.json');
  const targetCat = path.join(resultsDir, 'categories.json');

  if (fs.existsSync(sourceCat)) {
    fs.copyFileSync(sourceCat, targetCat);
    console.log(`[Allure Setup] Copied categories.json to: ${targetCat}`);
  } else {
    console.warn(`[Allure Setup] Warning: categories.json not found at ${sourceCat}`);
  }
}

setupAllureMetadata();
