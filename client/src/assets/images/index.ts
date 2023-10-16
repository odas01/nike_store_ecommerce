const images = {
   avatar: new URL('./avatar.jpg', import.meta.url).href,
   logo: new URL('./logo/logo.png', import.meta.url).href,
   logo_dark: new URL('./logo/logo_dark.png', import.meta.url).href,
   logo_home: new URL('./logo/logo_home.png', import.meta.url).href,
   auth_db: new URL('./background/auth_db.jpg', import.meta.url).href,
   appearance: new URL('./appearance.svg', import.meta.url).href,
   flag: {
      vi: new URL('./flag/vi.png', import.meta.url).href,
      en: new URL('./flag/en.png', import.meta.url).href,
   },
   slogan: {
      payment: new URL('./slogan/payment.png', import.meta.url).href,
      return: new URL('./slogan/return.png', import.meta.url).href,
      shipping: new URL('./slogan/shipping.png', import.meta.url).href,
      support: new URL('./slogan/support.png', import.meta.url).href,
   },
   bannerr: new URL('./banner.png', import.meta.url).href,
   banner: {
      top: new URL('./banner/top.jpg', import.meta.url).href,
      parent: new URL('./banner/parent.jpg', import.meta.url).href,
      kids: new URL('./banner/kids.jpg', import.meta.url).href,
      men: new URL('./banner/men.jpg', import.meta.url).href,
   },
   empty_cart: new URL('./cart/emptyCart.png', import.meta.url).href,
   thank: new URL('./checkout/thanks.png', import.meta.url).href,
};

export default images;
