import { create } from "zustand";
interface useProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const userProModal = create<useProModalStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
