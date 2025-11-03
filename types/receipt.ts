export interface Receipt {
  id?: string;
  name: string; // naziv računa
  type: string; // kategorija (npr. hrana, prevoz...)
  date: string; // datum
  total: number; // ukupan iznos
  qrData?: string | null; // sadržaj QR koda
  userId?: string; // dodaje se automatski u Firestore
  createdAt?: Date; // dodaje se automatski
}
