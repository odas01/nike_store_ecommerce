import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
   PayPalScriptProvider,
   PayPalButtons,
   usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

import '@/i18n';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         keepPreviousData: true,
         staleTime: 60 * 1000,
      },
   },
});

const clientId: string = import.meta.env.VITE_GOOGLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={queryClient}>
      <HelmetProvider>
         <GoogleOAuthProvider clientId={clientId}>
            <App />
         </GoogleOAuthProvider>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
   </QueryClientProvider>
);
