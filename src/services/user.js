import "@firebase/firestore";

import { db, auth } from "../configs/firebase";

export async function addUser(data) {
  return db.collection("user").doc(auth.currentUser?.uid).set(data);
}

export async function getCurrentUser() {
  return (await db.collection("user").doc(auth.currentUser?.uid).get()).data();
}

export function updateUser(userData) {
  return db
    .collection("user")
    .doc(auth.currentUser?.uid)
    .set(userData, { merge: true });
}

export function saveForm(formData) {
  return db
    .collection("forms")
    .doc(auth.currentUser?.uid)
    .set(formData, { merge: true });
}
