import { toast, TypeOptions, ToastPosition } from 'react-toastify';

export const notify = (
   type: TypeOptions,
   message: string,
   position: ToastPosition = 'top-center',
   theme?: 'light' | 'dark'
) => {
   return toast(message, {
      type,
      position,
      theme,
      autoClose: 1500,
   });
};
