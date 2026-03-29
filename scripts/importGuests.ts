import { db } from '../firebase';
import { GUEST_LIST } from '../constants';
import { collection, addDoc } from 'firebase/firestore';

async function importGuests() {
  for (const name of GUEST_LIST) {
    await addDoc(collection(db, 'guests'), { name });
    console.log(`Adicionado: ${name}`);
  }
  console.log('Importação concluída!');
}

importGuests();