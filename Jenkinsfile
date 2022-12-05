node {
	def app
	stage('Clone repository') {
		git 'https://github.com/wyoung163/meow_v2'
	}
	stage('Build image') {
		app = docker.build("choiwyoung/prbasedtest")
	}
	stage('Test image') {
		app.inside {
<<<<<<< HEAD
			steps {
               			sh 'npm install'
		                sh 'node index.js'
	            }		
=======
			echo 'npm install'
			sh 'npm install'
			echo 'node index'
			sh 'node index.js'
>>>>>>> db455dd637fe75d26e114936d51fa8ac8cb5b644
		}
	}
	stage('Push image') {
		docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
			app.push("$env.BUILD_NUMBER}")
			app.push("latest")
		}
	}
}
