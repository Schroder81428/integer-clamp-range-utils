import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, wrap, reflect, contains } from '../src/index.js';

test('clamp keeps values inside the range', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test('clamp swaps reversed bounds', () => {
  assert.equal(clamp(5, 10, 0), 5);
  assert.equal(clamp(-1, 10, 0), 0);
  assert.equal(clamp(11, 10, 0), 10);
});

test('clamp handles a degenerate range', () => {
  assert.equal(clamp(7, 3, 3), 3);
});

test('wrap uses a half-open interval', () => {
  assert.equal(wrap(0, 0, 4), 0);
  assert.equal(wrap(3, 0, 4), 3);
  assert.equal(wrap(4, 0, 4), 0);
  assert.equal(wrap(5, 0, 4), 1);
});

test('wrap normalises negative values', () => {
  assert.equal(wrap(-1, 0, 4), 3);
  assert.equal(wrap(-4, 0, 4), 0);
  assert.equal(wrap(-5, 0, 4), 3);
});

test('wrap handles non-zero lower bounds', () => {
  assert.equal(wrap(0, 3, 7), 4);
  assert.equal(wrap(7, 3, 7), 3);
  assert.equal(wrap(-1, 3, 7), 3);
});

test('wrap collapses a single-element range', () => {
  assert.equal(wrap(42, 5, 5), 5);
  assert.equal(wrap(-42, 5, 5), 5);
});

test('wrap swaps reversed bounds', () => {
  assert.equal(wrap(5, 7, 3), wrap(5, 3, 7));
});

test('reflect bounces off both endpoints', () => {
  assert.equal(reflect(0, 0, 4), 0);
  assert.equal(reflect(4, 0, 4), 4);
  assert.equal(reflect(5, 0, 4), 3);
  assert.equal(reflect(8, 0, 4), 0);
});

test('reflect handles negative values', () => {
  assert.equal(reflect(-1, 0, 4), 1);
  assert.equal(reflect(-4, 0, 4), 4);
  assert.equal(reflect(-5, 0, 4), 3);
});

test('reflect handles non-zero lower bounds', () => {
  assert.equal(reflect(3, 3, 7), 3);
  assert.equal(reflect(7, 3, 7), 7);
  assert.equal(reflect(8, 3, 7), 6);
});

test('reflect collapses a single-element range', () => {
  assert.equal(reflect(99, 5, 5), 5);
});

test('contains tests the closed interval', () => {
  assert.equal(contains(0, 0, 4), true);
  assert.equal(contains(4, 0, 4), true);
  assert.equal(contains(5, 0, 4), false);
  assert.equal(contains(-1, 0, 4), false);
});

test('contains swaps reversed bounds', () => {
  assert.equal(contains(2, 4, 0), true);
  assert.equal(contains(5, 4, 0), false);
});

test('non-integer arguments are rejected', () => {
  assert.throws(() => clamp(1.5, 0, 10), TypeError);
  assert.throws(() => wrap(1.5, 0, 10), TypeError);
  assert.throws(() => reflect(1.5, 0, 10), TypeError);
  assert.throws(() => contains(1.5, 0, 10), TypeError);
});
