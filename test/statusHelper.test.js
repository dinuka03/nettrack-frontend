import test from 'node:test'
import assert from 'node:assert/strict'
import { getStatusConfig } from '../src/utils/statusHelper.js'

test('getStatusConfig: returns correct config for READY status', () => {
  const config = getStatusConfig('READY', null, false, '2026-10-17T12:00:01Z')
  assert.strictEqual(config.label, 'Active Monitoring')
  assert.strictEqual(config.tone, 'ready')
  assert.strictEqual(config.hasRates, true)
  assert.strictEqual(config.pulseDot, true)
})

test('getStatusConfig: returns correct config for BASELINE_ONLY status', () => {
  const config = getStatusConfig('BASELINE_ONLY', null, false, '2026-10-17T12:00:01Z')
  assert.strictEqual(config.label, 'Establishing Baseline')
  assert.strictEqual(config.tone, 'baseline')
  assert.strictEqual(config.hasRates, false)
  assert.strictEqual(config.pulseDot, true)
})

test('getStatusConfig: returns correct config for INITIAL status', () => {
  const config = getStatusConfig('INITIAL', null, false, null)
  assert.strictEqual(config.label, 'Initializing')
  assert.strictEqual(config.tone, 'initial')
  assert.strictEqual(config.hasRates, false)
})

test('getStatusConfig: returns correct config for ERROR status', () => {
  const config = getStatusConfig('ERROR', null, false, '2026-10-17T12:00:01Z')
  assert.strictEqual(config.label, 'Sampling Error')
  assert.strictEqual(config.tone, 'error')
  assert.strictEqual(config.hasRates, false)
})

test('getStatusConfig: handles network error without previous reading as Offline', () => {
  const config = getStatusConfig(null, 'Failed to fetch', false, null)
  assert.strictEqual(config.label, 'Offline')
  assert.strictEqual(config.tone, 'offline')
  assert.strictEqual(config.hasRates, false)
})

test('getStatusConfig: handles network error with retained previous reading as Reconnecting', () => {
  const config = getStatusConfig('READY', 'Failed to fetch', true, '2026-10-17T12:00:01Z')
  assert.strictEqual(config.label, 'Reconnecting')
  assert.strictEqual(config.tone, 'warning')
  assert.strictEqual(config.hasRates, true)
  assert.match(config.description, /Retaining last reading/)
})

