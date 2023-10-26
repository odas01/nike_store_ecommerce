import { create } from 'zustand';

type Store = {
   open: boolean;
};

type Actions = {
   setOpen: (open: boolean) => void;
};

const initialState = {
   open: false,
};

const useOpenAuth = create<Store & Actions>()((set) => ({
   ...initialState,
   setOpen: (open) => set({ open }),
}));

export default useOpenAuth;
