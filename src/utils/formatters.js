/**
 * Formats a number as Colombian Peso (COP) currency.
 * @param {number} amount - The amount to format.
 * @param {boolean} includeDecimals - Whether to include decimals in the output. Default is true for small amounts, false for whole numbers.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
    const numericAmount = Number(amount) || 0;
    
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericAmount);
};
