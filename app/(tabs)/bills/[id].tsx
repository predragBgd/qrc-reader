import { Receipt } from "@/types/receipt";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function BillDetails() {
  const router = useRouter();
  const { id, data } = useLocalSearchParams();
  const receipt: Receipt | null = data ? JSON.parse(data as string) : null;

  if (!receipt) {
    return (
      <View style={styles.container}>
        <Text>Nema podataka o računu.</Text>
      </View>
    );
  }

  const goToEdit = () => {
    const idParam = Array.isArray(id) ? id[0] : id;
    router.push({
      pathname: "/(tabs)/bills/edit/[id]",
      params: { id: idParam, data: JSON.stringify(receipt) },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Nazad</Text>
      </Pressable>

      <Text style={styles.title}>{receipt.name}</Text>
      <Text>Tip: {receipt.type}</Text>
      <Text>Iznos: {receipt.total.toFixed(2)} RSD</Text>
      <Text>Datum: {receipt.date || "Nepoznato"}</Text>

      <View style={styles.editButton}>
        <Button title="Izmeni račun" onPress={goToEdit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  back: { color: "#007AFF", marginBottom: 10, fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  editButton: { marginTop: 20 },
});
