node {
	def app
	stage('Clone repository') {
		git 'https://github.com/wyoung163/meow_v2.git'
		
	}
	stage('Build image') {
		app = docker.build("choiwyoung/prbasedtest")
	}
	stage('Test image') {
		app.inside {
			steps {
               			sh 'npm install'
		                sh 'npm start'
		}
	}
	stage('Push image') {
		docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
			app.push("$env.BUILD_NUMBER}")
			app.push("latest")
		}
	}
}
