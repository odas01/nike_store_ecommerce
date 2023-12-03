import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const initialOptions = {
   clientId: 'test',
   currency: 'USD',
};

interface PaypalProps {
   amount: string;
   handleSaveOrder: (paid: boolean) => void;
}

const Paypal: React.FC<PaypalProps> = ({ amount, handleSaveOrder }) => {
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
