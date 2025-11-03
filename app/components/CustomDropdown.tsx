import { useCategories } from "@/hooks/useCategories";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CustomDropdownProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function CustomDropdown({
  selectedValue,
  onValueChange,
}: CustomDropdownProps) {
  const { categories, addCategory } = useCategories();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Kada korisnik odabere kategoriju ili "Dodaj novu"
  const handleSelect = (value: string) => {
    if (value === "Dodaj novu kategoriju") {
      setAdding(true);
      setOpen(false); // ✅ zatvori dropdown
      return;
    }
    onValueChange(value);
    setOpen(false);
  };

  // Dodavanje nove kategorije
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    await addCategory(newCategory.trim());
    onValueChange(newCategory.trim());
    setNewCategory("");
    setAdding(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown dugme */}
      <Pressable style={styles.dropdown} onPress={() => setOpen(true)}>
        <Text style={selectedValue ? styles.value : styles.placeholder}>
          {selectedValue || "Odaberi kategoriju..."}
        </Text>
      </Pressable>

      {/* Modal sa listom kategorija */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={[...categories, "Dodaj novu kategoriju"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === "Dodaj novu kategoriju" && styles.addOption,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Modal za dodavanje nove kategorije */}
      <Modal visible={adding} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addModal}>
            <View style={styles.addContainer}>
              <Text style={styles.addTitle}>Nova kategorija</Text>
              <TextInput
                style={styles.input}
                placeholder="Unesi naziv kategorije"
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Button
                  title="Odustani"
                  color="gray"
                  onPress={() => setAdding(false)}
                />
                <Button title="Sačuvaj" onPress={handleAddCategory} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  dropdown: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f3f2f2ff",
  },
  placeholder: { color: "#999" },
  value: { color: "#000" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16 },
  addOption: { color: "#007AFF", fontWeight: "600" },
  addModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  addContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  addTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
