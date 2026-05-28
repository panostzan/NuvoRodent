const BASE = 227.698333
const PER_SHORT = 24.855000
const PER_LONG = 35.783889
const PER_STORY = -0.185556
const SHORT_LONG = 0.003889
const SHORT_STORY = 8.048611
const LONG_STORY = 10.608333
const GST = 0.05
const COMMISSION = 0.0909

export function calculatePrice(shortSides, longSides, stories) {
  const st = stories - 1
  const preGST =
    BASE +
    shortSides * PER_SHORT +
    longSides * PER_LONG +
    st * PER_STORY +
    shortSides * longSides * SHORT_LONG +
    shortSides * st * SHORT_STORY +
    longSides * st * LONG_STORY

  return {
    preGST,
    priceWithGST: preGST * (1 + GST),
    commission: preGST * COMMISSION,
  }
}
