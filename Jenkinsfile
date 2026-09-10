pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
        jdk 'JDK-17'
    }

    environment {
        CI = 'true'
        TEST_ENV = 'qa'
        TEST_CREDENTIALS = credentials('apeco-portal-test-credentials')
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npx playwright test'
                }
            }
        }

        stage('Prepare Allure Metadata') {
            steps {
                sh 'node scripts/setup-allure-env.js'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {
        always {
            // Publish Allure Report using the official Jenkins Allure Plugin
            allure([
                includeProperties: true,
                jdk: 'JDK-17',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            // Archive raw reports as Jenkins artifacts
            archiveArtifacts artifacts: 'allure-report/**, playwright-report/**', allowEmptyArchive: true
        }
        failure {
            echo "Pipeline completed with failures. Inspect the Allure Report dashboard for root cause analysis."
        }
    }
}
