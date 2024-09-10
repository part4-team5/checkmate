import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

type AuthState = {
	user: User | null;
	setUser: (user: User) => void;
	clearUser: () => void;
};

const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{
			name: "auth-storage",
		},
	),
);

export default useAuthStore;
