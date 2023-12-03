import { Navigate } from 'react-router-dom';

import cartStore from '@/stores/cartStore';

interface PrivateCheckOutRouteProps {
   component: React.FC;
}

const PrivateCheckOutRoute: React.FC<PrivateCheckOutRouteProps> = ({
   component: Component,
}) => {
   const { qty } = cartStore();

   if (qty) return <Component />;
   return <Navigate to='/cart' />;
};

export default PrivateCheckOutRoute;
