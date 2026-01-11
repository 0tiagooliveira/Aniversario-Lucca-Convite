
export interface PartyDetails {
  celebrant: string;
  age: number;
  date: string; // ISO format or display string
  time: string;
  location: {
    name: string;
    address: string;
    mapUrl: string;
  };
  giftList: GiftItem[];
}

export interface GiftItem {
  id: string;
  name: string;
  priceRange?: string;
  link?: string;
  category?: string;
  reservedBy?: string;
}

export interface RSVPData {
  name: string;
  count: number;
  confirmed: boolean;
  message?: string;
}
