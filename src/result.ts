/**
 * @file result.ts
 * @description A robust, type-safe implementation of the Result pattern for TypeScript.
 * This module provides a structured way to handle operations that can either succeed (Ok)
 * or fail (Err), eliminating the need for untyped exceptions and providing better
 * compile-time safety.
 *
 * @author Hoang Tien (tienhmjs)
 * @license MIT
 */

/*
 * Discriminant tags used to distinguish between Ok and Err states at runtime.
 */
const OK = 'ok'
const ERR = 'err'
type OK = typeof OK
type ERR = typeof ERR

/**
 * A type representing a successful operation.
 * It contains a value of type `T`.
 *
 * @template T - The type of the successful value.
 *
 * @example
 * const success: Ok<string> = ok("Hello World");
 */
export type Ok<T> = {
    /**
     * Internal tag used for type narrowing.
     * Use {@link isOk} to check this state.
     *
     * @private
     */
    readonly _tag: OK

    /**
     * The underlying value of a successful operation.
     *
     * @deprecated Direct access to `_value` is discouraged to maintain encapsulation.
     * Use the {@link unwrapOk} function to safely access this value after narrowing type.
     * @private
     */
    readonly _value: T
}

/**
 * A type representing a failed operation.
 * It contains an error of type `E`.
 *
 * @template E - The type of the error, which must extend the native `Error` class.
 *
 * @example
 * const failure: Err<Error> = err(new Error("Database connection failed"));
 */
export type Err<E extends Error> = {
    /**
     * Internal tag used for type narrowing.
     * Use {@link isErr} to check this state.
     *
     * @private
     */
    readonly _tag: ERR

    /**
     * The underlying error object of a failed operation.
     *
     * @deprecated Direct access to `_error` is discouraged to maintain encapsulation.
     * Use the {@link unwrapErr} function to safely access this error after narrowing type.
     * @private
     */
    readonly _error: E
}

/**
 * A union type representing either a success (Ok) or a failure (Err).
 * This is the primary type used for function return values to ensure callers handle both cases.
 *
 * @template T - The expected successful value type. Defaults to `unknown`.
 * @template E - The expected error type. Defaults to the native `Error`.
 */
export type Result<T, E extends Error = Error> = Ok<T> | Err<E>

/**
 * Constructs a successful Result (Ok) containing the provided value.
 *
 * @template T - The type of the value being wrapped.
 * @param value - The value to wrap in an Ok container.
 * @returns An {@link Ok} object representing success.
 */
export const ok = <T>(value: T): Ok<T> => ({ _tag: OK, _value: value })

/**
 * Constructs a failed Result (Err) containing the provided error object.
 *
 * @template T - The type of the error object (must extend Error).
 * @param error - The error object to wrap in an Err container.
 * @returns An {@link Err} object representing failure.
 */
export const err = <T extends Error>(error: T): Err<T> => ({ _tag: ERR, _error: error })

/**
 * A type guard that checks if a Result is a success (Ok).
 * Useful for narrowing the union type within conditional blocks.
 *
 * @template T - The success type of the Result.
 * @template E - The error type of the Result.
 * @param r - The Result object to inspect.
 * @returns `true` if the Result is {@link Ok}, narrowing the type of `r`.
 *
 * @example
 * if (isOk(result)) {
 *   const data = unwrapOk(result); // result is narrowed to Ok<T> here
 * }
 */
export const isOk = <T, E extends Error>(r: Result<T, E>): r is Ok<T> => r._tag === OK

/**
 * A type guard that checks if a Result is a failure (Err).
 * Useful for narrowing the union type within conditional blocks.
 *
 * @template T - The success type of the Result.
 * @template E - The error type of the Result.
 * @param r - The Result object to inspect.
 * @returns `true` if the Result is {@link Err}, narrowing the type of `r`.
 *
 * @example
 * if (isErr(result)) {
 *   const error = unwrapErr(result); // result is narrowed to Err<E> here
 * }
 */
export const isErr = <T, E extends Error>(r: Result<T, E>): r is Err<E> => !isOk(r)

/**
 * Safely extracts the value from a confirmed Ok result.
 *
 * Note: While this function provides access to the inner value, it should only be called
 * after narrowing the Result type using {@link isOk}.
 *
 * @template T - The type of the contained value.
 * @param ok - An {@link Ok} result object.
 * @returns The underlying successful value.
 */
export const unwrapOk = <T>(ok: Ok<T>): Ok<T>['_value'] => ok._value

/**
 * Safely extracts the error from a confirmed Err result.
 *
 * Note: While this function provides access to the inner error, it should only be called
 * after narrowing the Result type using {@link isErr}.
 *
 * @template E - The type of the contained error.
 * @param err - An {@link Err} result object.
 * @returns The underlying error object.
 */
export const unwrapErr = <E extends Error>(err: Err<E>): Err<E>['_error'] => err._error
