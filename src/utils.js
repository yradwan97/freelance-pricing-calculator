export const CURRENCY_OPTIONS = [
  { code: 'EGP', label: 'Egyptian Pound (EGP)' },
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
];

export function formatCurrency(amount, currencyCode = 'EGP') {
  const grouped = Math.round(amount || 0).toLocaleString('en-US');
  return `${currencyCode} ${grouped}`;
}
