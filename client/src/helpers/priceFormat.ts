export const priceFormat = (price: number, isVn: boolean) => {
   if (!isVn) {
      price = +Math.ceil(price / 24500);
   }

   return `${isVn ? '₫' : '$'}${price.toLocaleString('en-ES')}`;
};
