import { auth } from "@/services/firebaseConfig";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, StyleSheet, Text, View } from "react-native";
import useAuth from "../../hooks/useAuth";
import ScanReceipt from "../components/ScanReceipt";

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Učitavanje...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dobrodošao u QRC Reader</Text>
        <View style={{ marginTop: 20 }}>
          <Button
            title="Prijavi se"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            title="Registruj se"
            onPress={() => router.push("/(auth)/register")}
          />
        </View>
      </View>
    );
  }

  // 👇 Ako je korisnik prijavljen → prikaži kameru za skeniranje
  return (
    <View style={{ flex: 1 }}>
      <ScanReceipt />
      <View style={styles.logoutButton}>
        <Button title="Odjavi se" onPress={() => signOut(auth)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
