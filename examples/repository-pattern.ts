import { ok, err, isErr, unwrapOk, unwrapErr, type Result } from '../src/index.js'

/**
 * 2. Repository Pattern Example (Mirroring real-world usage)
 */

interface User {
    id: string
    name: string
    email: string
}

/**
 * A repository function that fetches data from an API.
 *
 * Instead of throwing, it returns a Promise<Result<User, Error>>.
 * This pattern ensures that any consumer MUST handle the error case.
 */
export async function fetchUserRepository(id: string): Promise<Result<User, Error>> {
    try {
        // Simulated API call
        if (id === '999') {
            return err(new Error(`User with ID ${id} not found`))
        }

        const userData: User = {
            id: id,
            name: 'Hoang Tien',
            email: 'tien@example.com',
        }

        // Return success result
        return ok(userData)
    } catch (e) {
        // Convert untyped exceptions from network or JSON parsing into a typed Error result
        const message = e instanceof Error ? e : new Error(String(e))
        return err(message as Error)
    }
}

// Handling multiple repositories
export async function deleteUserRepository(id: string): Promise<Result<boolean, Error>> {
    // Logic for deleting...
    return ok(true)
}
