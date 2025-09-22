pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
        git branch: 'main', 
            url: 'https://github.com/KILLERAMOGH592/Gaming-Tournament-Portal.git', 
            credentialsId: '587469b0-568d-406b-aa15-95297518155e'
    }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("project-app:latest")
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh 'docker rm -f project-app || true'
                    sh 'docker run -d -p 5173:5173 --name project-app project-app:latest'
                }
            }
        }
    }
}
