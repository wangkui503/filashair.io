export function shortBPS(xfers) {
    if (!xfers) return null
const bps = xfers?.reduce(
    (accumulator, currentValue) => +accumulator + +currentValue.progress?.bps,
    0,
  );
  if (!bps) return null

  let shortBPS = bps + 'bps'
  if (bps) {
    if (bps%1000000000 > 0) {
      shortBPS = (bps/1000000000).toFixed(2) + 'Gb'
    } else if (bps%1000000 > 0) {
      shortBPS = (bps/1000000).toFixed(2) + 'Mb'
    }
  }
  return shortBPS
}
  