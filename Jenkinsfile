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
               		sh 'npm install'
		        //sh 'npm start'
		}
	}
	stage('Push image') {
		docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
<<<<<<< HEAD
			app.push("${env.BUILD_NUMBER}")
=======
			app.push("{$env.BUILD_NUMBER}")
>>>>>>> 8f554e5... docs: add a missing bracket
			app.push("latest")
		}
	}
}
