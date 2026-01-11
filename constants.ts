
import { PartyDetails } from './types';

export const PARTY_DATA: PartyDetails = {
  celebrant: "Lucca",
  age: 1,
  date: "2026-04-25T14:00:00",
  time: "14:00",
  location: {
    name: "Conjunto Ouro Verde",
    address: "Rua Marechal Otávio Saldanha Mazza, 6740 - Capão Raso, Curitiba - PR, 81130-220",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Marechal+Otávio+Saldanha+Mazza+6740+Curitiba"
  },
  giftList: [
    { id: "1", name: "Roupas (Tamanho 1 a 2 anos)", link: "#" },
    { id: "2", name: "Brinquedos Pedagógicos", link: "#" },
    { id: "3", name: "Fraldas G / XG", link: "#" },
    { id: "4", name: "Livros de Banho / Texturas", link: "#" },
    { id: "5", name: "Vale Presente", link: "#" }
  ]
};

export const GUEST_LIST = [
  "Papai", "Mamãe", "Marisa", "Cleide", "Teté", "Wesley", "Luiza", "Geovana", "Bruno", "Silvana", 
  "Caciane", "Arthur", "Raiane", "Alexandre", "Rose", "Antony", "Lucas", 
  "Gabriela", "Terezinha", "Carlinhos", "Acedina", "Beth", "Renato", 
  "Leonardo", "Andréia", "Marido Andréia", "Sabrina", "Edina", "Elcio", "Anselmo"
];

export const GUEST_PHOTOS: Record<string, string> = {
  "Marisa": "/Marisa.png",
  "Cleide": "/Cleide.png",
  "Teté": "/Teté.png",
  "Wesley": "/Wesley.png",
  "Rose": "/Rose.png",
  "Lucas": "/Lucas.png",
  "Antony": "/Antoni.png",
  "Caciane": "/Cassiane.png",
  "Papai": "/Papai.png",
  "Mamãe": "/Mamãe.png",
  "Geovana": "/Geovana.png",
  "Sabrina": "/Sabrina.png",
  "Bruno": "/Bruno.png",
  "Luiza": "/Luiza.png",
  "Terezinha": "/Teresinha.png",
  "Silvana": "/Silvana.png",
  "Anselmo": "/Anselmo e Andréia.png",
  "Andréia": "/Anselmo e Andréia.png",
  "Alexandre": "/Alexandre.png"
};

export const SYSTEM_PROMPT = `Você é o Guia do Safari do Lucca! 🦒🦁🦓
O Lucca está comemorando seu 1º aninho (Primeiro Aniversário!) com uma expedição Safari incrível.
Informações Importantes:
- Data: 25 de Abril de 2026, às 14:00.
- Local: ${PARTY_DATA.location.name} (${PARTY_DATA.location.address}).
- Idade: Ele faz 1 ano! É uma festa de "Primeiro Reinado na Selva".
Responda sempre com muito carinho, use emojis de bebês e animais. 
Seja prestativo com os convidados da lista oficial. 
Sugira roupas leves e confortáveis para os convidados.`;
