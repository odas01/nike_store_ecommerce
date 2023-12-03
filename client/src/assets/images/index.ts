const images = {
   avatar: new URL('./avatar.jpg', import.meta.url).href,
   logo2: new URL('./logo/logo2.png', import.meta.url).href,
   logo: new URL('./logo/logo.png', import.meta.url).href,
   auth_logo: new URL('./logo/auth_logo.png', import.meta.url).href,
   auth_db: new URL('./background/auth_db.jpg', import.meta.url).href,
   auth_bg: new URL('./background/auth.jpg', import.meta.url).href,
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
   social: {
      instagram: new URL('./social/instagram.png', import.meta.url).href,
      facebook: new URL('./social/facebook.png', import.meta.url).href,
      google: new URL('./social/google.png', import.meta.url).href,
   },
   empty_cart: new URL('./cart/emptyCart.png', import.meta.url).href,
   thank: new URL('./checkout/thanks.png', import.meta.url).href,
   user: new URL('./avatar/user.png', import.meta.url).href,
   vnpay: new URL('./payment/vnpay.png', import.meta.url).href,
};

export default images;
