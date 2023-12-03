import { create } from 'zustand';

type Store = {
   success: boolean;
};

type Actions = {
   setSuccess: (success: boolean) => void;
};

const initialState = {
   success: false,
};

const orderSuccessStore = create<Store & Actions>((set) => ({
   ...initialState,
   setSuccess: (success) => set({ success }),
}));

export default orderSuccessStore;
