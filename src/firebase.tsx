import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

if (window.location.host === 'cms.baldwindesign.co') {
	firebase.initializeApp({
		apiKey: 'AIzaSyDJiji869tLzkTpR6vs1GBxXYif_1fYnpc',
		authDomain: 'content-management-syste-a9a11.firebaseapp.com',
		databaseURL: 'https://content-management-syste-a9a11.firebaseio.com',
		projectId: 'content-management-syste-a9a11',
		storageBucket: 'content-management-syste-a9a11.appspot.com',
		messagingSenderId: '854702838143',
		appId: '1:854702838143:web:a9dffaaf5a38b6826fca4a',
		measurementId: 'G-2QW6M415T1'
	});
} else {
	firebase.initializeApp({
		apiKey: 'AIzaSyBHshsyQaYO3-2iiO2JqOu7Hg8LkWvUb3E',
		authDomain: 'content-management-system-dev.firebaseapp.com',
		databaseURL: 'https://content-management-system-dev.firebaseio.com',
		projectId: 'content-management-system-dev',
		storageBucket: 'content-management-system-dev.appspot.com',
		messagingSenderId: '499203573769',
		appId: '1:499203573769:web:fdc4fbbb969942e09c10d8'
	});

	if (window.location.hostname === 'localhost') {
		firebase.functions().useFunctionsEmulator('http://localhost:5001');
		firebase.firestore().settings({
			host: 'localhost:8080',
			ssl: false
		});
	}
}

export default firebase;
