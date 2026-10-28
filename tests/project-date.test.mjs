import assert from 'node:assert/strict'
import test from 'node:test'
import { formatProjectDate, projectTimestamp } from '../project-date.js'

const now = Date.parse('2026-10-27T13:28:00Z')

test('naive API timestamps are UTC while explicit offsets retain their meaning', () => {
  assert.equal(projectTimestamp('2026-10-27T12:28:00'), Date.parse('2026-10-27T12:28:00Z'))
  assert.equal(projectTimestamp('2026-10-27 12:28:00.123'), Date.parse('2026-10-27T12:28:00.123Z'))
  assert.equal(projectTimestamp('2026-10-27T14:28:00+02:00'), Date.parse('2026-10-27T12:28:00Z'))
  assert.equal(formatProjectDate('2026-10-27T12:28:00', now), '1 hour ago')
})

test('recent projects use relative dates and older projects show a full date', () => {
  assert.equal(formatProjectDate('2026-10-27T13:27:40Z', now), 'Just now')
  assert.equal(formatProjectDate('2026-10-27T13:26:00Z', now), '2 minutes ago')
  assert.equal(formatProjectDate('2026-10-21T13:28:01Z', now), '5 days ago')
  assert.equal(formatProjectDate('2026-10-20T13:28:00Z', now), new Date('2026-10-20T13:28:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
  assert.equal(formatProjectDate('2026-10-27T15:28:00Z', now), 'in 2 hours')
  assert.equal(formatProjectDate(null, now), '')
  assert.equal(formatProjectDate('invalid', now), '')
})
