import { useEffect } from 'react';

const DiaflowBot = () => {
   useEffect(() => {
      (function (d, m) {
         var kommunicateSettings = {
            appId: '37540c19aec6856a82985ed6ef3078d42',
            popupWidget: true,
            automaticChatOpenOnNavigation: true,
         };
         var s = document.createElement('script');
         s.type = 'text/javascript';
         s.async = true;
         s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
         var h = document.getElementsByTagName('head')[0];
         h.appendChild(s);
         (window as any).kommunicate = m;
         m._globals = kommunicateSettings;
      })(document, (window as any).kommunicate || {});
   }, []);
   return <></>;
};

export default DiaflowBot;
