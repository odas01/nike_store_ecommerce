import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';

import { Input, Error, Button } from '@/components';
import { BsGoogle } from 'react-icons/bs';
import { authApi } from '@/api';
import { notify } from '@/helpers';

const formSchema = zod
   .object({
      name: zod.string().nonempty('Name is required!'),
      email: zod.string().nonempty('Email is required!').email('Invalid email'),
      password: zod.string().nonempty('Password is required!'),
      confirmPassword: zod.string().nonempty('Password is required!'),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
   });

type SignupFormValues = zod.infer<typeof formSchema>;

interface LoginFormProps {
   setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<LoginFormProps> = ({ setIsLoginForm }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<SignupFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const onSubmit = handleSubmit(async (values) => {
      const { name, email, password } = values;
      try {
         const res: any = await authApi.signup({
            name,
            email,
            password,
         });
         notify('success', res.message);
         console.log(res);
      } catch (err: any) {
         notify('error', err.message);
      }
   });

   return (
      <form onSubmit={onSubmit} className='h-full flex flex-col'>
         <div className='[&_label]:text-sm [&_label]:font-normal [&>div]:space-y-1'>
            <div className='flex flex-col'>
               <label htmlFor='name'>Name</label>
               <Input
                  placeholder='Type your name'
                  {...register('name')}
                  isError={!!errors.name}
               />
               <Error message={errors?.name && errors.name.message} />
            </div>
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
            <div className='flex flex-col'>
               <label htmlFor='confirmPassword'>Confirm password</label>
               <Input
                  placeholder='Type your confirmPassword'
                  {...register('confirmPassword')}
                  isError={!!errors.confirmPassword}
               />
               <Error
                  message={
                     errors?.confirmPassword && errors.confirmPassword.message
                  }
               />
            </div>
         </div>
         <Button className='w-full py-3 mt-4'>Log in</Button>
         <p className='text-center text-xs font-normal text-gray-800 mt-4'>
            Or Sign Up with
         </p>
         <div className='flex justify-center mt-2'>
            <div className='p-2 bg-red-400 rounded-full'>
               <BsGoogle color='#fff' />
            </div>
         </div>
         <div className='text-center text-sm mt-auto space-x-1'>
            <span className='text-[#7e7e7e]'>Already have an account?</span>
            <span
               className='text-[#4f4f4f] font-semibold duration-150 hover:text-[#3c3c3c] cursor-pointer'
               onClick={() => setIsLoginForm(true)}
            >
               Log in
            </span>
         </div>
      </form>
   );
};

export default SignupForm;
