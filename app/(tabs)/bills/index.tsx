import { deleteReceipt, getReceipts } from "@/services/receiptService";
import { Receipt } from "@/types/receipt";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function Bills() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const router = useRouter();

  const loadReceipts = async () => {
    const data = await getReceipts();
    setReceipts(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadReceipts();
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteReceipt(id);
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  const renderRightActions = (id: string) => (
    <Pressable style={styles.deleteButton} onPress={() => handleDelete(id)}>
      <Text style={styles.deleteText}>Obriši</Text>
    </Pressable>
  );

  const filteredReceipts =
    selectedType === "all"
      ? receipts
      : receipts.filter((r) => r.type === selectedType);

  const purchaseTypes = ["all", ...new Set(receipts.map((r) => r.type))];
  const totalSum = filteredReceipts.reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sačuvani računi</Text>

      <Picker
        selectedValue={selectedType}
        onValueChange={setSelectedType}
        style={styles.picker}
      >
        {purchaseTypes.map((t) => (
          <Picker.Item
            key={t}
            label={t === "all" ? "Svi tipovi" : t}
            value={t}
          />
        ))}
      </Picker>

      <FlatList
        data={filteredReceipts}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id!)}>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/bills/[id]",
                  params: { id: item.id!, data: JSON.stringify(item) },
                });
              }}
            >
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.type}</Text>
                <Text style={styles.total}>{item.total.toFixed(2)} RSD</Text>
              </View>
            </Pressable>
          </Swipeable>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ukupan zbir: {totalSum.toFixed(2)} RSD
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  picker: { marginBottom: 15, backgroundColor: "#f9f9f9" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  total: { fontSize: 16, color: "green", fontWeight: "600" },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 8,
    marginVertical: 5,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
  },
});
