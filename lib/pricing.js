// Illustrative portfolio pricing. Production rates are intentionally omitted.
const BASE = 250
const PER_SHORT = 25
const PER_LONG = 35
const PER_STORY = 0
const SHORT_LONG = 0
const SHORT_STORY = 5
const LONG_STORY = 8
const GST = 0.05
const COMMISSION = 0.10

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
