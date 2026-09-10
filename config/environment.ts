import dotenv from 'dotenv';
import path from 'path';

// Load environment files
const rootEnv = path.resolve(__dirname, '../.env');
const utilsEnv = path.resolve(__dirname, '../utils/env.example');
dotenv.config({ path: rootEnv });
dotenv.config({ path: utilsEnv });

export type EnvironmentName = 'dev' | 'qa' | 'staging';

interface EnvironmentConfig {
  name: EnvironmentName;
  baseURL: string;
  apiBaseURL: string;
  defaultTimeout: number;
}

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    name: 'dev',
    baseURL: process.env.DEV_BASE_URL || 'https://apeco-portal-dev.azurecontainerapps.io',
    apiBaseURL: process.env.DEV_API_URL || 'https://apeco-api-dev.azurecontainerapps.io',
    defaultTimeout: 30000,
  },
  qa: {
    name: 'qa',
    baseURL: process.env.QA_BASE_URL || 'https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io',
    apiBaseURL: process.env.QA_API_URL || 'https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/Identity/api',
    defaultTimeout: 30000,
  },
  staging: {
    name: 'staging',
    baseURL: process.env.STAGING_BASE_URL || 'https://apeco-portal-staging.azurecontainerapps.io',
    apiBaseURL: process.env.STAGING_API_URL || 'https://apeco-api-staging.azurecontainerapps.io',
    defaultTimeout: 30000,
  },
};

const currentEnv: EnvironmentName = (process.env.TEST_ENV as EnvironmentName) || 'qa';

export const ENV = {
  ...environments[currentEnv],
  credentials: {
    defaultUser: {
      email: process.env.TEST_EMAIL || 'apecouser@hotmail.com',
      password: process.env.TEST_PASSWORD || 'P0rtal#Cqnyp',
    },
    adminUser: {
      email: process.env.ADMIN_EMAIL || 'admin@apeco.ae',
      password: process.env.ADMIN_PASSWORD || 'Admin#2024Pass',
    },
  },
};
