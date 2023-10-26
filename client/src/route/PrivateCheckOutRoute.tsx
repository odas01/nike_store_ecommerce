import cartStore from '@/stores/cartStore';
import { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateCheckOutRouteProps {
   component: React.FC;
}

const PrivateCheckOutRoute: FC<PrivateCheckOutRouteProps> = ({
   component: Component,
}) => {
   const { qty } = cartStore();

   if (qty) return <Component />;
   return <Navigate to='/cart' />;
};

export default PrivateCheckOutRoute;
