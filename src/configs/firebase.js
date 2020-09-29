import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { FIREBASE_CONFIG } from "../constants/firebase";

firebase.initializeApp(FIREBASE_CONFIG);

const auth = firebase.auth();
const db = firebase.firestore();
export { auth, db };
