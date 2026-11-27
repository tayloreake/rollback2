import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('../hooks/useQuoteFormStart.js', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
)

test('quote start ignores non-fields and emits once per form without field values', () => {
  const events = []
  const exports = {}
  runInNewContext(outputText, {
    exports,
    require: (name) => {
      if (name === 'react') return { useRef: (current) => ({ current }) }
      if (name === '../utils/gtm') return { gtmTrackEvent: (event) => events.push({ ...event }) }
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  const page = exports.default('quote_page')
  const modal = exports.default('quote_modal')
  const change = (handler, name, visible = true) => handler({ target: { name, matches: () => visible, value: 'private form text' } })
  change(page, 'utm_source', false)
  change(page, 'website')
  assert.equal(events.length, 0)
  change(page, 'name')
  change(page, 'email')
  change(modal, 'moveType')
  change(modal, 'moveFrom')
  assert.deepEqual(events, [
    { event: 'quote_form_start', form_id: 'quote', placement: 'quote_page' },
    { event: 'quote_form_start', form_id: 'quote', placement: 'quote_modal' },
  ])
})
