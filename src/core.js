/**
 * Clamp an integer into the closed interval [min, max].
 *
 * If min > max the bounds are swapped, because callers routinely pass
 * reversed ranges when they compute bounds from cursor positions and
 * silently returning a value outside both bounds is worse than a swap.
 *
 * @param {number} value - Integer to clamp.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number} The clamped integer.
 */
export function clamp(value, min, max) {
  if (!Number.isInteger(value) || !Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError('clamp expects integer arguments');
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Wrap an integer into the half-open interval [min, max).
 *
 * The half-open convention is the one that composes: wrapping 0..n-1
 * keeps a coordinate on a ring without ever producing n, which is what
 * modular arithmetic callers expect. A single-element range is a fixed
 * point, so every input maps to min.
 *
 * JavaScript's % keeps the sign of the dividend, so the result is
 * normalised with a final addition rather than relying on % alone.
 *
 * @param {number} value - Integer to wrap.
 * @param {number} min - Inclusive lower bound.
 * @param {number} max - Exclusive upper bound.
 * @returns {number} The wrapped integer in [min, max).
 */
export function wrap(value, min, max) {
  if (!Number.isInteger(value) || !Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError('wrap expects integer arguments');
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  const span = max - min;
  if (span === 0) return min;
  const offset = value - min;
  const mod = ((offset % span) + span) % span;
  return min + mod;
}

/**
 * Reflect an integer into the closed interval [min, max] by bouncing
 * off the endpoints.
 *
 * Reflection is defined on the period 2 * (max - min), so values far
 * outside the range still land inside. A degenerate range (min === max)
 * is a fixed point. The arithmetic is done on the non-negative offset
 * from min to keep the sign handling in one place.
 *
 * @param {number} value - Integer to reflect.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number} The reflected integer in [min, max].
 */
export function reflect(value, min, max) {
  if (!Number.isInteger(value) || !Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError('reflect expects integer arguments');
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  const span = max - min;
  if (span === 0) return min;
  const period = span * 2;
  let offset = value - min;
  offset = ((offset % period) + period) % period;
  if (offset >= span) {
    offset = period - offset;
  }
  return min + offset;
}

/**
 * Test whether an integer lies in the closed interval [min, max].
 *
 * Bounds are swapped for the same reason as clamp: a reversed range
 * still describes the same set of integers.
 *
 * @param {number} value - Integer to test.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {boolean} True when min <= value <= max after normalisation.
 */
export function contains(value, min, max) {
  if (!Number.isInteger(value) || !Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError('contains expects integer arguments');
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  return value >= min && value <= max;
}
