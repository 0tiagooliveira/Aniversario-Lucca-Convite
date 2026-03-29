
import { PartyDetails } from './types';

export const PARTY_DATA: PartyDetails = {
  celebrant: "Lucca",
  age: 1,
  date: "2026-04-25T14:00:00",
  time: "14:00",
  location: {
    name: "Capela Velha",
    address: "Tv. Green Village, 40 - Capela Velha, Araucária - PR",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Tv.+Green+Village+40+Capela+Velha+Araucária"
  },
  giftList: [
    { id: "1", name: "Roupas Tamanho 1-2 anos", link: "#", category: "Vestuário" },
    { id: "2", name: "Sapatos Número 22-24", link: "#", category: "Vestuário" },
    { id: "3", name: "Fraldas G / XG", link: "#", category: "Necessidades" },
    { id: "4", name: "Toalhas de Banho Infantil", link: "#", category: "Necessidades" },
    { id: "5", name: "Livros de Banho", link: "#", category: "Educativo" },
    { id: "6", name: "Livros de Texturas", link: "#", category: "Educativo" },
    { id: "7", name: "Blocos de Montar Grandes", link: "#", category: "Brinquedos" },
    { id: "8", name: "Brinquedos de Encaixe", link: "#", category: "Brinquedos" },
    { id: "9", name: "Instrumentos Musicais Infantis", link: "#", category: "Brinquedos" },
    { id: "10", name: "Pelúcias Animais Safari", link: "#", category: "Brinquedos" },
    { id: "11", name: "Quebra-cabeça Baby", link: "#", category: "Educativo" },
    { id: "12", name: "Massinha de Modelar Atóxica", link: "#", category: "Educativo" },
    { id: "13", name: "Giz de Cera Jumbo", link: "#", category: "Educativo" },
    { id: "14", name: "Carrinho de Empurrar", link: "#", category: "Brinquedos" },
    { id: "15", name: "Bola Grande e Macia", link: "#", category: "Brinquedos" },
    { id: "16", name: "Conjuntos de Prato e Talher", link: "#", category: "Necessidades" },
    { id: "17", name: "Copos com Canudo", link: "#", category: "Necessidades" },
    { id: "18", name: "Cadeirinha de Alimentação Portátil", link: "#", category: "Necessidades" },
    { id: "19", name: "Mochila Infantil", link: "#", category: "Vestuário" },
    { id: "20", name: "Roupão de Banho", link: "#", category: "Vestuário" },
    { id: "21", name: "Pijamas Divertidos", link: "#", category: "Vestuário" },
    { id: "22", name: "Meias Antiderrapantes", link: "#", category: "Vestuário" },
    { id: "23", name: "Brinquedos de Puxar", link: "#", category: "Brinquedos" },
    { id: "24", name: "Kit Praia/Piscina", link: "#", category: "Brinquedos" },
    { id: "25", name: "Vale Presente Livraria", link: "#", category: "Vales" },
    { id: "26", name: "Vale Presente Loja de Brinquedos", link: "#", category: "Vales" }
  ]
};

export const GUEST_LIST = [
  "Papai", "Mamãe", "Marisa", "Cleide", "Teté", "Wesley", "Luiza", "Geovana", "Bruno",
  "Rose", "Antony", "Lucas", "Gabriela", "Terezinha", "Carlinhos", "Acedina", "Beth", "Renato",
  "Leonardo", "Andréia", "Sabrina", "Edina", "Elcio", "Anselmo"
];

export const toGuestKey = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
};

export const GUEST_PHOTOS: Record<string, string> = {
  "Marisa": "/Marisa.png",
  "Cleide": "/Cleide.png",
  "Teté": "/Teté.png",
  "Wesley": "/Wesley.png",
  "Rose": "/Rose.png",
  "Lucas": "/Lucas.png",
  "Antony": "/Antoni.png",
  "Papai": "/Papai.png",
  "Mamãe": "/Mamãe.png",
  "Geovana": "/Geovana.png",
  "Sabrina": "/Sabrina.png",
  "Bruno": "/Bruno.png",
  "Luiza": "/Luiza.png",
  "Terezinha": "/Teresinha.png",
  "Anselmo": "/Anselmo e Andréia.png",
  "Andréia": "/Anselmo e Andréia.png",
  "Edna": "/Edna.jpeg",
  "Ilsom": "/Ilsom.jpeg",
    "Acedina": "/Acedina.png",
  "Matheus": "/Matheus.png",
  "Elivelton": "/Elivelton.png",
  "Leonardo": "/Leonardo.jpeg",
  "Gustavo": "/Gustavo.png",
  "Beth": "/Beth.jpeg",
  "Gabrielly": "/Gabrielly.png"
  ,"Carlinhos": "/Carlinhos.jpeg"
  ,"Renato": "/Renato.jpeg"
  ,"João": "/João.png"
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
