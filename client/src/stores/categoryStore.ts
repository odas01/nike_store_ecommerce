// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// import { ICategory, IColor, ISize } from '@/types';

// type Store = {
//    sizes: ISize[];
//    colors: IColor[];
//    categories: ICategory[];
// };

// type Actions = {
//    fetchSizes: () => void;
//    fetchColors: () => void;
//    fetchCategories: () => void;
// };

// const initialState = {
//    categories: [],
//    sizes: [],
//    colors: [],
// };

// const categoryStore = create<Store & Actions>()(
//    persist(
//       (set, get) => ({
//          ...initialState,
//          fetchSizes() {

//          },
//       }),
//       {
//          name: 'category-store',
//       }
//    )
// );

// export default categoryStore;
