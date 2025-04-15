import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/types/user";

type UsersState = {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
};

const STORAGE_KEY = "@users";

const USERS_KEY = "stored_users";

export const UsersStore = {
  saveUsers: async (users: any[]) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  },

  loadUsers: async (): Promise<any[]> => {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading users:", error);
      return [];
    }
  },

  clearUsers: async () => {
    try {
      await AsyncStorage.removeItem(USERS_KEY);
    } catch (error) {
      console.error("Error clearing users:", error);
    }
  },
};

export const saveUsersToStorage = async (users: User[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users:", e);
  }
};

export const loadUsersFromStorage = async (): Promise<User[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading users:", e);
    return [];
  }
};

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}));
