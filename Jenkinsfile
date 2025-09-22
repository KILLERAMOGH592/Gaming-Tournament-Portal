pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/project.git'
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
