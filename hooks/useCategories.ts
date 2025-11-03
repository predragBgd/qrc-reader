import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "categories";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  // Učitaj kategorije iz AsyncStorage-a pri pokretanju
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setCategories(JSON.parse(stored));
        else setCategories(["Hrana", "Računi", "Prevoz", "Zabava", "Ostalo"]);
      } catch (err) {
        console.error("Greška pri učitavanju kategorija:", err);
      }
    })();
  }, []);

  // Funkcija za dodavanje nove kategorije
  const addCategory = async (newCategory: string) => {
    const updated = [...categories, newCategory];
    setCategories(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { categories, addCategory };
}
