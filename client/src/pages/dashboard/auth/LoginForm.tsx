import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import authStore from '@/stores/authStore';
import { Input, Error, Button } from '@/components';

const formSchema = zod.object({
   email: zod.string().nonempty('Email is required!').email('Invalid email'),
   password: zod.string().nonempty('Password is required!'),
});

type LoginFormValues = zod.infer<typeof formSchema>;

const LoginForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<LoginFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const { adminLogin } = authStore();

   const onSubmit = handleSubmit(async (values) => {
      await adminLogin(values);
   });

   return (
      <form onSubmit={onSubmit} className='h-full flex flex-col'>
         <div className='[&_label]:text-sm [&_label]:font-normal [&>div]:space-y-1'>
            <div className='flex flex-col'>
               <label htmlFor='email'>Email</label>
               <Input
                  placeholder='Type your email'
                  {...register('email')}
                  isError={!!errors.email}
               />
               <Error message={errors?.email && errors.email.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='password'>Password</label>
               <Input
                  placeholder='Type your password'
                  {...register('password')}
                  isError={!!errors.password}
               />
               <Error message={errors?.password && errors.password.message} />
            </div>
         </div>
         <Button className='w-full py-3 mt-4'>Log in</Button>
         {/* <p className='text-center text-xs font-normal text-gray-800 mt-4'>
            Or Sign Up with
         </p>
         <div className='flex justify-center mt-2'>
            <div className='p-2 bg-red-400 rounded-full'>
               <BsGoogle color='#fff' />
            </div>
         </div> */}
         {/* <div className='text-center text-sm mt-auto space-x-1'>
            <span className='text-[#7e7e7e]'>Don't have an account?</span>
            <span
               className='text-[#4f4f4f] font-semibold duration-150 hover:text-[#3c3c3c] cursor-pointer'
               onClick={() => setIsLoginForm(false)}
            >
               Sign Up
            </span>
         </div> */}
      </form>
   );
};

export default LoginForm;
