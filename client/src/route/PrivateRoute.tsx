import authStore from '@/stores/authStore';
import { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface PropType {
   component: React.FC;
}

const PrivateRoute: FC<PropType> = ({ component: Component }) => {
   const { currentUser } = authStore();

   if (currentUser) return <Component />;
   return <Navigate to='/' />;
};

export default PrivateRoute;
