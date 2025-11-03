import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Receipt } from "../types/receipt";
import { auth, db } from "./firebaseConfig";

// Sačuva novi račun za trenutno logovanog korisnika

export async function saveReceipt(receipt: Receipt): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Nema logovanog korisnika");

  const docRef = await addDoc(collection(db, "receipts"), {
    ...receipt,
    userId: user.uid,
    createdAt: new Date(),
  });

  return docRef.id;
}

// Dohvati sve račune trenutno logovanog korisnika

export async function getReceipts(): Promise<Receipt[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("Nema logovanog korisnika");

  const q = query(collection(db, "receipts"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Receipt[];
}

// Izmeni račun po njegovom ID-ju

export async function updateReceipt(id: string, updatedData: Partial<Receipt>) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nema logovanog korisnika");

  const docRef = doc(db, "receipts", id);

  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date(),
  });
}

//Obriši račun po njegovom ID-ju

export async function deleteReceipt(id: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Nema logovanog korisnika");

  const docRef = doc(db, "receipts", id);
  await deleteDoc(docRef);
}
