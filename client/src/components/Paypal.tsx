import { orderApi } from '@/api';
import {
   PayPalScriptProvider,
   PayPalButtons,
   usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { FC, useEffect } from 'react';

// This value is from the props in the UI
const style = { layout: 'horizontal' };

const initialOptions = {
   clientId: 'test',
   currency: 'USD',
};

interface PaypalProps {
   amount: string;
   handleSaveOrder: (paid: boolean) => void;
}

const Paypal: FC<PaypalProps> = ({ amount, handleSaveOrder }) => {
   return (
      <PayPalScriptProvider options={initialOptions}>
         <PayPalButtons
            style={{
               color: 'silver',
               layout: 'horizontal',
               height: 48,
               tagline: false,
               shape: 'pill',
            }}
            forceReRender={[amount, handleSaveOrder]}
            createOrder={(_, actions) =>
               actions.order
                  .create({
                     purchase_units: [
                        {
                           amount: { value: amount },
                        },
                     ],
                  })
                  .then((orderId) => orderId)
            }
            onApprove={(_, actions) => {
               return actions.order!.capture().then((details) => {
                  if (details.status === 'COMPLETED') {
                     handleSaveOrder(true);
                  }
               });
            }}
         />
      </PayPalScriptProvider>
   );
};
export default Paypal;
