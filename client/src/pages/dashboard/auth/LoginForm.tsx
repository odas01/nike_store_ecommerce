import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Error, Button } from '@/components';

import authStore from '@/stores/authStore';
import { authApi } from '@/api';
import { ILogin } from '@/types';
import { notify } from '@/helpers';

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
   } = useForm<LoginFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });
   const { i18n, t } = useTranslation(['mutual', 'home']);
   const isVnLang = i18n.language === 'vi';

   const { saveToken, setCurrentUser } = authStore();

   const loginMutation = useMutation({
      mutationFn: (values: ILogin) => authApi.adminLogin(values),
      onSuccess: async ({ user, token, message }) => {
         saveToken(token);
         setCurrentUser(user);
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      loginMutation.mutate(values);
   });

   return (
      <form onSubmit={onSubmit} className='flex flex-col h-full'>
         <div className='[&_label]:text-sm [&_label]:font-normal [&>div]:space-y-1'>
            <div className='flex flex-col'>
               <label htmlFor='email'>Email</label>
               <Input
                  placeholder={t('placeHolder.typeEmail', { ns: 'home' })}
                  {...register('email')}
                  isError={!!errors.email}
               />
               <Error message={errors?.email && errors.email.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='password'>{t('label.password')}</label>
               <Input
                  type='password'
                  placeholder={t('placeHolder.typePassword', { ns: 'home' })}
                  {...register('password')}
                  isError={!!errors.password}
               />
               <Error message={errors?.password && errors.password.message} />
            </div>
         </div>
         <Button className='w-full py-3 mt-4'>{t('action.login')}</Button>
      </form>
   );
};

export default LoginForm;
