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
   } = useForm<LoginFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const { adminLogin } = authStore();

   const onSubmit = handleSubmit(async (values) => {
      await adminLogin(values);
   });

   return (
      <form onSubmit={onSubmit} className='flex flex-col h-full'>
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
      </form>
   );
};

export default LoginForm;
