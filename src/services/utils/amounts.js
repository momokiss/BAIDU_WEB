export const formatQuote = amount => {
  return (amount / 1000000).toFixed(2)
}

export const numberWithSymbol = (target, symbol) => {
  if (!target) r