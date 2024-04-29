import {create} from 'zustand';

interface useStoreNavBar {
    isToggle: boolean;
    toggleTrueFalse: () => void;
  }
  const useNavBarToggle = create<useStoreNavBar>((set) => ({
    isToggle: false,
    toggleTrueFalse: () => set((state) => ({ isToggle: !state.isToggle })),
  }));

export default useNavBarToggle;