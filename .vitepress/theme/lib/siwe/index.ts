/* ERC-4361 message parser, linter and fixer.
 *
 * Ported unchanged from the validator that shipped on docs.siwe.xyz. It was
 * written as framework-free TypeScript, so the whole engine moved across and
 * only the interface was rebuilt. */

export { ValidationEngine } from './validationEngine'
export { SiweMessageParser } from './parser'
export { FieldValidators } from './validators'
export { SecurityValidators } from './securityValidators'
export { AutoFixer } from './autoFixer'
export { FieldReplacer } from './fieldReplacer'
export { LineBreakValidator } from './lineBreakValidator'

export type * from './types'
