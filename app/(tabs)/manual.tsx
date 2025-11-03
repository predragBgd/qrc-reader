import CustomDropdown from "@/app/components/CustomDropdown";
import { saveReceipt } from "@/services/receiptService";
import { Receipt } from "@/types/receipt";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Manual() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date()); // ✅ mora biti Date objekat
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !type || !total) {
      Alert.alert("Greška", "Popuni sva polja!");
      return;
    }

    const newReceipt: Receipt = {
      name,
      type,
      date: date.toISOString().split("T")[0], // ✅ koristi izabrani datum
      total: parseFloat(total),
      qrData: null,
    };

    try {
      await saveReceipt(newReceipt);
      Alert.alert("Uspeh", "Račun je sačuvan u Firestore!");

      // reset forme
      setName("");
      setType("");
      setTotal("");
      setDate(new Date());

      router.push("/(tabs)/bills");
    } catch (err: any) {
      Alert.alert("Greška", err.message || "Neuspešno čuvanje računa");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Unesi račun ručno</Text>

        <TextInput
          style={styles.input}
          placeholder="Naziv računa"
          value={name}
          onChangeText={setName}
        />

        {/* ✅ Izbor datuma */}
        <Pressable onPress={() => setShowPicker(true)}>
          <Text style={[styles.input, { paddingVertical: 14 }]}>
            {date.toLocaleDateString("sr-RS")}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Tip</Text>
        <CustomDropdown selectedValue={type} onValueChange={setType} />

        <TextInput
          style={styles.input}
          placeholder="Ukupan iznos"
          keyboardType="numeric"
          value={total}
          onChangeText={setTotal}
        />

        <Button title="Sačuvaj račun" onPress={handleSave} />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Vidi sve račune"
            onPress={() => router.push("/(tabs)/bills")}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
});
