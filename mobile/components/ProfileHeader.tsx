import React from "react";
import { View, Text, Image } from "react-native";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/profile.styles";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
    </View>
  );
}
