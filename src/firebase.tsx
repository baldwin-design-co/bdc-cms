import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
	apiKey: 'AIzaSyBHshsyQaYO3-2iiO2JqOu7Hg8LkWvUb3E',
	authDomain: 'content-management-system-dev.firebaseapp.com',
	databaseURL: 'https://content-management-system-dev.firebaseio.com',
	projectId: 'content-management-system-dev',
	storageBucket: 'content-management-system-dev.appspot.com',
	messagingSenderId: '499203573769',
	appId: '1:499203573769:web:fdc4fbbb969942e09c10d8'
});

export default firebase;
