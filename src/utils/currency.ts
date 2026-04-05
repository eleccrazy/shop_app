import { copy } from '../content/copy';

export function formatCurrency(amount: number) {
  const formattedAmount = new Intl.NumberFormat(copy.locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return `${copy.currencySymbol} ${formattedAmount}`;
}
