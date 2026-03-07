import { ok, err, isOk, isErr, unwrapOk, unwrapErr, type Result } from '../src/index.js'

/**
 * 1. Simple Utility Function Examples
 */

// Math-related utility showing controlled error handling
function parseInteger(input: string): Result<number, Error> {
    const parsed = parseInt(input, 10)
    if (isNaN(parsed)) {
        return err(new Error(`Failed to parse "${input}" as integer`))
    }
    return ok(parsed)
}

// Validation-related utility
function validateAge(age: number): Result<number, Error> {
    if (age < 0 || age > 120) {
        return err(new Error('Age must be between 0 and 120'))
    }
    return ok(age)
}

// Usage:
const input = '42'
const parsedResult = parseInteger(input)

if (isOk(parsedResult)) {
    const value = unwrapOk(parsedResult)
    console.log('Successfully parsed:', value)
} else {
    const error = unwrapErr(parsedResult)
    console.error('Parsing failed:', error.message)
}
