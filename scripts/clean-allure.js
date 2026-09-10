/**
 * Script: clean-allure.js
 * Cross-platform clean script to safely wipe allure-results and allure-report directories.
 */

const fs = require('fs');
const path = require('path');

const dirsToClean = [
  path.resolve(__dirname, '../allure-results'),
  path.resolve(__dirname, '../allure-report'),
  path.resolve(__dirname, '../test-results/screenshots'),
  path.resolve(__dirname, '../test-results/videos'),
  path.resolve(__dirname, '../test-results/traces'),
];

dirsToClean.forEach((dir) => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`[Clean] Successfully removed: ${dir}`);
    } catch (err) {
      console.warn(`[Clean] Could not remove directory ${dir}: ${err.message}`);
    }
  }
});
