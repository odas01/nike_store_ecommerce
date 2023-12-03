import { Navigate } from 'react-router-dom';

import authStore from '@/stores/authStore';

interface PropType {
   component: React.FC;
}

const PrivateRoute: React.FC<PropType> = ({ component: Component }) => {
   const { currentUser } = authStore();

   if (currentUser) return <Component />;
   return <Navigate to='/' />;
};

export default PrivateRoute;
