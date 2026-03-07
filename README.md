# simple-result

A lightweight, zero-dependency, **type-safe `Result` type** implementation for TypeScript.

Inspired by Rust's Error Handling, `simple-result` allows you to handle success and failure explicitly without the unpredictability of untyped `try/catch` blocks.

[![npm](https://img.shields.io/npm/v/@tienhmdev/simple-result)](https://www.npmjs.com/package/@tienhmdev/simple-result)
[![license](https://img.shields.io/npm/l/@tienhmdev/simple-result)](./LICENSE.md)

---

## 🚀 Why simple-result?

In standard TypeScript, functions that throw errors are not represented in the type system. This leads to:

- **Hidden Bugs**: Forgetting to catch an exception.
- **Untyped Errors**: The `catch(e)` block gives you an `any` or `unknown` type.
- **Fragile Code**: Control flow jumps unexpectedly across layers.

**`simple-result` solves this by making errors part of the return type.**

---

## 📦 Installation

```sh
pnpm add @tienhmdev/simple-result
# or
npm install @tienhmdev/simple-result
```

---

## 🛠 Basic Usage

### 1. Creating Results

```ts
import { ok, err, Result } from '@tienhmdev/simple-result'

function divide(a: number, b: number): Result<number, Error> {
    if (b === 0) return err(new Error('Division by zero'))
    return ok(a / b)
}
```

### 2. Handling Results

```ts
import { isOk, isErr, unwrapOk, unwrapErr } from '@tienhmdev/simple-result'

const result = divide(10, 0)

if (isOk(result)) {
    console.log('Success:', unwrapOk(result)) // Narrowed to Ok<number>
} else {
    console.error('Failure:', unwrapErr(result).message) // Narrowed to Err<Error>
}
```

---

## 🏛 Real World Example: Repository Pattern

This utility is exceptionally powerful when used in data repositories to handle API responses or database queries.

### API Repository Implementation

```ts
import { Result, ok, err, isErr, unwrapOk, unwrapErr } from '@tienhmdev/simple-result'

interface User {
    id: string
    name: string
}

export const fetchUserRepository = async (userId: string): Promise<Result<User, Error>> => {
    try {
        const response = await fetch(`/api/users/${userId}`)

        if (!response.ok) {
            return err(new Error(`HTTP Error: ${response.status}`))
        }

        const data = await response.json()
        return ok(data as User)
    } catch (e) {
        // Convert unexpected exceptions into a typed Err
        return err(e instanceof Error ? e : new Error(String(e)))
    }
}
```

---

## 📖 API Reference

### Types

| Type           | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ | -------- |
| `Ok<T>`        | Represents a successful operation containing a value of type `T`.                    |
| `Err<E>`       | Represents a failed operation containing an error of type `E` (must extend `Error`). |
| `Result<T, E>` | A union type: `Ok<T>                                                                 | Err<E>`. |

### Guards & Utilities

| Function         | Signature                               | Description                                       |
| ---------------- | --------------------------------------- | ------------------------------------------------- |
| `ok(value)`      | `<T>(value: T) => Ok<T>`                | Wraps a value into an `Ok` result.                |
| `err(error)`     | `<E extends Error>(error: E) => Err<E>` | Wraps an Error into an `Err` result.              |
| `isOk(result)`   | `(r: Result<T, E>) => r is Ok<T>`       | Returns `true` if the result is success.          |
| `isErr(result)`  | `(r: Result<T, E>) => r is Err<E>`      | Returns `true` if the result is failure.          |
| `unwrapOk(ok)`   | `(ok: Ok<T>) => T`                      | Safely extracts the value from a confirmed `Ok`.  |
| `unwrapErr(err)` | `(err: Err<E>) => E`                    | Safely extracts the error from a confirmed `Err`. |

---

## 🎯 Best Practices

1. **Be Explicit**: Always annotate return types with `Promise<Result<T, Error>>` for async operations.
2. **Early Return**: Check `isErr()` early in your function and return the error immediately to keep logic flat.
3. **Internal vs External**: Use standard `try/catch` internally at the very edge (like a fetch call) and immediately wrap the result in `ok()` or `err()`.

---

## 📄 License

MIT © Hoang Tien (tienhmdev)
