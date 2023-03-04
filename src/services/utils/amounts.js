export const formatQuote = amount => {
  return (amount / 1000000).toFixed(2)
}

export const numberWithSymbol = (target, symbol) => {
  if (!target) return

  let num = parseFloat(target)

  if (num % 1 === 0) {
    num = num.toFixed(0)
  } else {
    num = num.toFixed(2)
  }

  r