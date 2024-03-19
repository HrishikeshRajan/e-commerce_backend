import currency from 'currency.js';

export const getTax = (productPrice:number) => {
  const gst = 12;
  const tax = currency(productPrice).multiply(gst).divide(100).value;
  return Math.floor(tax);
};
