import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import styles from "@/assets/styles/home.styles";
import { UsersService } from "@/services/UsersService";
import {
  useUsersStore,
  loadUsersFromStorage,
  saveUsersToStorage,
} from "@/store/usersStore";
import type { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import Loader from "@/components/Loader";

export default function Home() {
  const { users, setUsers } = useUsersStore();
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const remote = await UsersService.getUsers();
      const local = await loadUsersFromStorage();

      if (remote.success) {
        const combined = [...local, ...remote.users];
        setUsers(combined);
      } else {
        console.error("Error fetching users:", remote.error);
        setUsers(local);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email || "");
    setModalVisible(true);
  };

  const saveUserChanges = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = {
        ...editingUser,
        name: editName,
        email: editEmail,
      };
      const updatedUsers = users.map((user) =>
        user.id.toString() === editingUser.id.toString() ? updatedUser : user
      );

      const storedUsers = await loadUsersFromStorage();
      const updatedStoredUsers = storedUsers.map((user) =>
        user.id.toString() === editingUser.id.toString()
          ? { ...user, name: editName, email: editEmail }
          : user
      );

      await saveUsersToStorage(updatedStoredUsers);
      setUsers(updatedUsers);

      setModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error");
    }
  };

  const confirmDeleteUser = (id: number | string) => {
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedUsers = users.filter((user) => {
                return user.id.toString() !== id.toString();
              });
              const storedUsers = await loadUsersFromStorage();
              const updatedStoredUsers = storedUsers.filter((user) => {
                return user.id.toString() !== id.toString();
              });

              await saveUsersToStorage(updatedStoredUsers);
              setUsers(updatedUsers);
            } catch (error) {
              console.error("Error deleting user:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.headerHome}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="pencil-outline" size={20} />
        </TouchableOpacity>
        <Text style={styles.username}>{item.username}</Text>
        <TouchableOpacity onPress={() => confirmDeleteUser(item.id)}>
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={styles.username}>Name</Text>
          <Text>{item.name}</Text>
          <Text style={styles.headerSubtitle}>{item.email}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={users as unknown as User[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>List of users</Text>
            <Text style={styles.headerSubtitle}>
              Discover users from the community{" "}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="person-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit User</Text>

            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput
              style={styles.inputEdit}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
            />

            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.inputEdit}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={saveUserChanges}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
