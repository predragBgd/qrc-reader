import { updateReceipt } from "@/services/receiptService";
import { Receipt } from "@/types/receipt";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditReceipt() {
  const router = useRouter();
  const { id, data } = useLocalSearchParams();
  const receipt: Receipt = data ? JSON.parse(data as string) : ({} as Receipt);

  const [name, setName] = useState(receipt.name);
  const [type, setType] = useState(receipt.type);
  const [total, setTotal] = useState(receipt.total.toString());
  const [date, setDate] = useState(
    receipt.date ? new Date(receipt.date) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!name || !type || !total) {
      Alert.alert("Greška", "Popuni sva polja!");
      return;
    }

    try {
      await updateReceipt(id as string, {
        name,
        type,
        total: parseFloat(total),
        date: date.toISOString(),
      });
      Alert.alert("Uspeh", "Račun je uspešno izmenjen!");
      router.push("/bills");
    } catch (err: any) {
      Alert.alert("Greška", err.message || "Neuspešna izmena računa");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={type} onChangeText={setType} />
      <TextInput
        style={styles.input}
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
      />
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
      <Button title="Sačuvaj izmene" onPress={handleSave} />
      <Button title="Odustani" color="red" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
