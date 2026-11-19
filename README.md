# integer-clamp-range-utils

Clamps, wraps, and reflects integer values into bounded ranges for modular coordinate systems.

```js
import { clamp, wrap, reflect, contains } from 'integer-clamp-range-utils';

clamp(12, 0, 10);    // 10
wrap(-1, 0, 4);      // 3
reflect(5, 0, 4);    // 3
contains(4, 0, 4);   // true
```

## Why this exists

When you build something that moves on a grid or a ring — a cursor, a tile index, a
modular coordinate — you keep needing the same three operations: stop at the edge,
loop back around, or bounce off the edge. They are each one line of arithmetic, but
the sign handling is easy to get wrong and the choice of interval convention is easy
to make inconsistently across a codebase.

This library fixes one convention per operation and applies it everywhere:

- `clamp` and `reflect` use the closed interval `[min, max]`.
- `wrap` uses the half-open interval `[min, max)`.

The half-open choice for `wrap` is deliberate: wrapping `0..n-1` should never yield
`n`, because that is what modular arithmetic callers expect. The trade-off is that
`wrap` and `clamp` do not agree on what the upper bound means, so the README says so
plainly instead of pretending the two are interchangeable.

## API

### `clamp(value, min, max) -> number`

Returns `value` limited to `[min, max]`. If `min > max` the bounds are swapped.

### `wrap(value, min, max) -> number`

Returns `value` mapped into `[min, max)` by modular arithmetic. Negative inputs
are normalised, so `wrap(-1, 0, 4)` is `3`. A range where `min === max` is a fixed
point and every input maps to `min`.

### `reflect(value, min, max) -> number`

Returns `value` mapped into `[min, max]` by bouncing off the endpoints. The period
is `2 * (max - min)`, so values far outside the range still land inside. A range
where `min === max` is a fixed point.

### `contains(value, min, max) -> boolean`

Tests membership in `[min, max]`. Bounds are swapped if reversed.

## Edge cases

All four functions require integer arguments and throw a `TypeError` otherwise.
Reversed bounds are swapped rather than rejected, because callers routinely compute
bounds from cursor positions and a silent swap is less surprising than a value
outside both bounds. The one asymmetry to remember is the interval convention:
`wrap` excludes its upper bound, `clamp` and `reflect` include it.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

