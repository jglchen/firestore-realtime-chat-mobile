import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';

const firebaseConfig = {
    apiKey: API_KEY || process.env.EXPO_PUBLIC_API_KEY,
    authDomain: AUTH_DOMAIN || process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: DATABASE_URL || process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: PROJECT_ID || process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: STORAGE_BUCKET || process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: APP_ID || process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
