import React, { useContext, useState } from 'react';
import LoginForm from './LoginForm';
import { useTranslation } from 'react-i18next';
import SignupForm from './SignupForm';

const AuthForm = () => {
   const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
   const { t } = useTranslation('mutual');
   return (
      <div>
         <h2 className='mb-4 text-xl font-bold text-center uppercase text-zinc-700'>
            {isLoginForm ? t('action.login') : t('action.signup')}
         </h2>
         {isLoginForm ? (
            <LoginForm setIsLoginForm={setIsLoginForm} />
         ) : (
            <SignupForm setIsLoginForm={setIsLoginForm} />
         )}
      </div>
   );
};

export default AuthForm;
