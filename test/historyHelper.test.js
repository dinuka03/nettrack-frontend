import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTotalBytes, formatHistoryRecord } from '../src/utils/historyHelper.js'

test('calculateTotalBytes: correctly sums rx and tx byte counts', () => {
  assert.strictEqual(calculateTotalBytes(1000, 2000), 3000)
  assert.strictEqual(calculateTotalBytes(0, 0), 0)
  assert.strictEqual(calculateTotalBytes(1048576, 524288), 1572864)
})

test('calculateTotalBytes: handles null, undefined, and partial missing counts', () => {
  // If one side is valid and the other is null/undefined
  assert.strictEqual(calculateTotalBytes(500, null), 500)
  assert.strictEqual(calculateTotalBytes(undefined, 750), 750)
  assert.strictEqual(calculateTotalBytes(100, NaN), 100)

  // If both are invalid, returns null
  assert.strictEqual(calculateTotalBytes(null, null), null)
  assert.strictEqual(calculateTotalBytes(undefined, undefined), null)
  assert.strictEqual(calculateTotalBytes(-50, -100), null)
})

test('formatHistoryRecord: formats a complete valid record with units and total', () => {
  const record = {
    id: 101,
    interfaceName: 'wlp3s0',
    rxBytesDelta: 4194304, // 4 MB
    txBytesDelta: 1048576, // 1 MB
    durationSeconds: 1.0,
    recordedAt: '2026-10-22T08:30:00Z',
  }

  const formatted = formatHistoryRecord(record)

  assert.strictEqual(formatted.id, 101)
  assert.strictEqual(formatted.downloaded, '4.00 MB')
  assert.strictEqual(formatted.uploaded, '1.00 MB')
  assert.strictEqual(formatted.total, '5.00 MB')
  assert.strictEqual(formatted.duration, '1.00s')
  assert.strictEqual(formatted.interfaceName, 'wlp3s0')
  assert.notStrictEqual(formatted.recordedTime, '—')
})

test('formatHistoryRecord: handles zero delta bytes without NaN', () => {
  const record = {
    id: 102,
    interfaceName: 'wlp3s0',
    rxBytesDelta: 0,
    txBytesDelta: 0,
    durationSeconds: 1.002,
    recordedAt: '2026-10-22T08:30:01Z',
  }

  const formatted = formatHistoryRecord(record)

  assert.strictEqual(formatted.id, 102)
  assert.strictEqual(formatted.downloaded, '0 B')
  assert.strictEqual(formatted.uploaded, '0 B')
  assert.strictEqual(formatted.total, '0 B')
  assert.strictEqual(formatted.duration, '1.00s')
})

test('formatHistoryRecord: safely handles missing, invalid, or null fields', () => {
  assert.deepStrictEqual(formatHistoryRecord(null), {
    id: null,
    recordedTime: '—',
    timeOnly: '—',
    downloaded: '—',
    uploaded: '—',
    total: '—',
    duration: '—',
    interfaceName: 'wlp3s0',
  })

  const corruptRecord = {
    id: undefined,
    interfaceName: null,
    rxBytesDelta: null,
    txBytesDelta: -10,
    durationSeconds: null,
    recordedAt: 'invalid-date',
  }

  const formatted = formatHistoryRecord(corruptRecord)

  assert.strictEqual(formatted.id, null)
  assert.strictEqual(formatted.downloaded, '—')
  assert.strictEqual(formatted.uploaded, '—')
  assert.strictEqual(formatted.total, '—')
  assert.strictEqual(formatted.duration, '—')
  assert.strictEqual(formatted.recordedTime, '—')
  assert.strictEqual(formatted.interfaceName, 'wlp3s0')
})

test('History list: preserves newest-first backend order', () => {
  const records = [
    { id: 3, rxBytesDelta: 300, txBytesDelta: 30, durationSeconds: 1, recordedAt: '2026-10-22T08:30:03Z' },
    { id: 2, rxBytesDelta: 200, txBytesDelta: 20, durationSeconds: 1, recordedAt: '2026-10-22T08:30:02Z' },
    { id: 1, rxBytesDelta: 100, txBytesDelta: 10, durationSeconds: 1, recordedAt: '2026-10-22T08:30:01Z' },
  ]

  const mapped = records.map(formatHistoryRecord)

  assert.strictEqual(mapped[0].id, 3)
  assert.strictEqual(mapped[1].id, 2)
  assert.strictEqual(mapped[2].id, 1)
})

