import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Error, Button } from '@/components';
import { BsGoogle } from 'react-icons/bs';
import { authApi } from '@/api';
import { notify } from '@/helpers';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { ErrorResponse } from '@/types';
import { twMerge } from 'tailwind-merge';
import DotLoader from 'react-spinners/DotLoader';

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
   const { t } = useTranslation(['home', 'mutual']);

   const signupMutation = useMutation({
      mutationFn: (values) => authApi.signup(values),
      onSuccess: () => {
         setIsLoginForm(true);
         notify('success', `Sign up succesfully`);
      },

      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const onSubmit = handleSubmit(async (values: any) => {
      const { confirmPassword, ...newValues } = values;
      signupMutation.mutate(newValues);
   });

   return (
      <form onSubmit={onSubmit} className='flex flex-col h-full'>
         <div className='[&_label]:text-sm [&_label]:font-normal [&>div]:space-y-1'>
            <div className='flex flex-col'>
               <label htmlFor='name'>Name</label>
               <Input
                  placeholder={t('placeHolder.typeYourName')}
                  {...register('name')}
                  isError={!!errors.name}
               />
               <Error message={errors?.name && errors.name.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='email'>Email</label>
               <Input
                  placeholder={t('placeHolder.typeEmail')}
                  {...register('email')}
                  isError={!!errors.email}
               />
               <Error message={errors?.email && errors.email.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='password'>Password</label>
               <Input
                  placeholder={t('placeHolder.typePassword')}
                  {...register('password')}
                  isError={!!errors.password}
               />
               <Error message={errors?.password && errors.password.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='confirmPassword'>Confirm password</label>
               <Input
                  placeholder={t('placeHolder.typePasswordAgain')}
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
         <Button
            className={twMerge(
               'w-full py-3 mt-4 bg-[#3085C3] hover:bg-[#316e9c] flex justify-center items-center space-x-2',
               signupMutation.isLoading &&
                  'cursor-not-allowed bg-[#316e9c] select-none'
            )}
            disabled={signupMutation.isLoading}
         >
            {signupMutation.isLoading && <DotLoader color='#fff' size={20} />}
            <span>{t('action.signup', { ns: 'mutual' })}</span>
         </Button>
         <p className='mt-4 text-xs font-normal text-center text-gray-800'>
            {t('orLoginWith')}
         </p>
         <div className='flex justify-center mt-2'>
            <div className='p-2 bg-red-400 rounded-full'>
               <BsGoogle color='#fff' />
            </div>
         </div>
         <div className='mt-8 space-x-1 text-sm text-center'>
            <span className='text-[#7e7e7e]'> {t('haveAccount?')}</span>
            <span
               className='text-[#4f4f4f] font-semibold duration-150 hover:text-[#3c3c3c] cursor-pointer'
               onClick={() => setIsLoginForm(true)}
            >
               {t('action.login', { ns: 'mutual' })}
            </span>
         </div>
      </form>
   );
};

export default SignupForm;
