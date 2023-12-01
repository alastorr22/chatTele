import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzHQefdWXj2wwfPqLsPvBWjx2LZ6A-GyY",
  authDomain: "prueba2-bbfae.firebaseapp.com",
  projectId: "prueba2-bbfae",
  storageBucket: "prueba2-bbfae.appspot.com",
  messagingSenderId: "483999072781",
  appId: "1:483999072781:web:2bdba3e4e7f0420d674b44"
};

const fb = firebase.initializeApp(firebaseConfig);
export const db = fb.firestore();