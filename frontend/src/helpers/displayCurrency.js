export const displayCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPrice = (price) => {
  return displayCurrency(price);
};