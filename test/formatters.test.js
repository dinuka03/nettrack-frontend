import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatRate,
  formatBytes,
  formatDuration,
  formatTimestamp,
  formatDateTime,
} from '../src/utils/formatters.js'

test('formatRate: handles invalid or missing inputs safely without NaN', () => {
  assert.deepStrictEqual(formatRate(null), { value: '—', unit: '', formatted: '—' })
  assert.deepStrictEqual(formatRate(undefined), { value: '—', unit: '', formatted: '—' })
  assert.deepStrictEqual(formatRate(NaN), { value: '—', unit: '', formatted: '—' })
  assert.deepStrictEqual(formatRate(-100), { value: '—', unit: '', formatted: '—' })
  assert.deepStrictEqual(formatRate('invalid'), { value: '—', unit: '', formatted: '—' })
  assert.deepStrictEqual(formatRate(Infinity), { value: '—', unit: '', formatted: '—' })
})

test('formatRate: formats zero correctly as active zero rate', () => {
  assert.deepStrictEqual(formatRate(0), { value: '0.0', unit: 'B/s', formatted: '0.0 B/s' })
})

test('formatRate: formats B/s, KB/s, MB/s, and GB/s thresholds accurately', () => {
  // Bytes / sec
  const bRate = formatRate(500)
  assert.strictEqual(bRate.value, '500.0')
  assert.strictEqual(bRate.unit, 'B/s')
  assert.strictEqual(bRate.formatted, '500.0 B/s')

  // Kilobytes / sec (1024 base)
  const kbRate = formatRate(2048)
  assert.strictEqual(kbRate.value, '2.0')
  assert.strictEqual(kbRate.unit, 'KB/s')
  assert.strictEqual(kbRate.formatted, '2.0 KB/s')

  // Megabytes / sec
  const mbRate = formatRate(5 * 1024 * 1024)
  assert.strictEqual(mbRate.value, '5.00')
  assert.strictEqual(mbRate.unit, 'MB/s')
  assert.strictEqual(mbRate.formatted, '5.00 MB/s')

  // Gigabytes / sec
  const gbRate = formatRate(2.5 * 1024 * 1024 * 1024)
  assert.strictEqual(gbRate.value, '2.50')
  assert.strictEqual(gbRate.unit, 'GB/s')
  assert.strictEqual(gbRate.formatted, '2.50 GB/s')
})

test('formatBytes: handles invalid, zero, and scaling values', () => {
  assert.strictEqual(formatBytes(null), '—')
  assert.strictEqual(formatBytes(undefined), '—')
  assert.strictEqual(formatBytes(-1), '—')
  assert.strictEqual(formatBytes(NaN), '—')
  assert.strictEqual(formatBytes(0), '0 B')
  assert.strictEqual(formatBytes(512), '512 B')
  assert.strictEqual(formatBytes(1536), '1.5 KB')
  assert.strictEqual(formatBytes(2 * 1024 * 1024), '2.00 MB')
  assert.strictEqual(formatBytes(10 * 1024 * 1024 * 1024), '10.00 GB')
})

test('formatDuration: formats valid durations and rejects non-positive', () => {
  assert.strictEqual(formatDuration(null), '—')
  assert.strictEqual(formatDuration(0), '—')
  assert.strictEqual(formatDuration(-1.5), '—')
  assert.strictEqual(formatDuration(1.0), '1.00s')
  assert.strictEqual(formatDuration(1.998), '2.00s')
  assert.strictEqual(formatDuration(0.5), '0.50s')
})

test('formatTimestamp: parses ISO timestamp correctly and rejects invalid', () => {
  assert.strictEqual(formatTimestamp(null), '—')
  assert.strictEqual(formatTimestamp(''), '—')
  assert.strictEqual(formatTimestamp('not-a-date'), '—')

  const valid = formatTimestamp('2026-10-17T12:00:01Z')
  assert.notStrictEqual(valid, '—')
  assert.match(valid, /^\d{2}:\d{2}:\d{2}$/)
})

test('formatDateTime: parses ISO timestamp correctly and rejects invalid', () => {
  assert.strictEqual(formatDateTime(null), '—')
  assert.strictEqual(formatDateTime(''), '—')
  assert.strictEqual(formatDateTime('invalid-date'), '—')

  const valid = formatDateTime('2026-10-22T08:30:00Z')
  assert.notStrictEqual(valid, '—')
  assert.match(valid, /2026/)
})


