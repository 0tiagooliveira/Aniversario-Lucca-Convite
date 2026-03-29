import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';

const GUESTS_COLLECTION = 'guests';

export interface Guest {
  id?: string;
  name: string;
}

export async function fetchGuests(): Promise<Guest[]> {
  const snapshot = await getDocs(collection(db, GUESTS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Guest[];
}

export async function addGuest(name: string): Promise<void> {
  await addDoc(collection(db, GUESTS_COLLECTION), { name });
}

export async function removeGuest(id: string): Promise<void> {
  await deleteDoc(doc(db, GUESTS_COLLECTION, id));
}