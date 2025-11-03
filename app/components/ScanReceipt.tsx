import CustomDropdown from "@/app/components/CustomDropdown";
import { saveReceipt } from "@/services/receiptService";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function ScanReceipt() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Proveravam dozvolu...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Treba nam dozvola za kameru</Text>
        <Button title="Dozvoli kameru" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setQrData(data);

    if (data.startsWith("http")) {
      try {
        const res = await fetch(data);
        const html = await res.text();

        const match = html.match(/Укупан износ.*?([\d.,]+)/);
        if (match) {
          const val = match[1].replace(/\./g, "").replace(",", ".");
          setTotal(parseFloat(val));
        } else {
          Alert.alert("Greška", "Nisam pronašao ukupan iznos.");
        }
      } catch (err) {
        Alert.alert("Greška", "Ne mogu da preuzmem podatke sa sajta.");
      }
    } else {
      Alert.alert("QR kod skeniran", `Sadržaj: ${data}`);
    }
  };

  const handleSave = async () => {
    if (!name || !type || !date || !total) {
      Alert.alert("Greška", "Popuni sva polja!");
      return;
    }

    try {
      await saveReceipt({
        name,
        type,
        date,
        total,
        qrData,
      });
      Alert.alert("Uspeh", "Račun je uspešno sačuvan u Firestore!");

      // Reset forme
      setName("");
      setType("");
      setDate(new Date().toISOString().split("T")[0]);
      setTotal(null);
      setQrData(null);
      setScanned(false);
    } catch (err: any) {
      Alert.alert("Greška", err.message || "Neuspešno čuvanje računa");
    }
  };

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Text style={styles.label}>Naziv računa</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="npr. Lidl kupovina"
            />

            <Text style={styles.label}>Tip</Text>
            <CustomDropdown selectedValue={type} onValueChange={setType} />

            <Text style={styles.label}>Datum</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
            />

            {total !== null && (
              <Text style={styles.total}>
                Ukupan iznos: {total.toFixed(2)} RSD
              </Text>
            )}

            <Button title="Sačuvaj račun" onPress={handleSave} />
            <Button
              title="Skeniraj ponovo"
              onPress={() => {
                setScanned(false);
                setTotal(null);
                setQrData(null);
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: { flex: 1, padding: 20, justifyContent: "center" },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  total: { marginVertical: 10, fontSize: 18, fontWeight: "bold" },
});
