import { isErr, unwrapOk, unwrapErr, type Result } from '../src/index.js'
import { fetchUserRepository } from './repository-pattern.js'

/**
 * 3. Service Layer Example
 *
 * The Service layer consumes results from Repositories and performs business logic.
 */

async function userProfileService(userId: string) {
    console.log(`--- Fetching Profile for User ID: ${userId} ---`)

    // Explicitly handle failure without try/catch
    const result = await fetchUserRepository(userId)

    if (isErr(result)) {
        // 1. Log or handle the error
        const error = unwrapErr(result)
        console.warn(`[Service Error]: ${error.message}`)

        // 2. Return a business-layer friendly error structure or alternative result
        return {
            status: 'error',
            message: 'Failed to retrieve profile. Please try again later.',
        }
    }

    // At this point, TS knows 'result' is Ok<User>
    const user = unwrapOk(result)
    console.log(`[Service Success]: Found user ${user.name}`)

    return {
        status: 'success',
        data: user,
    }
}

// --- Test the Service ---
;(async () => {
    await userProfileService('123') // Success case
    await userProfileService('999') // Failure case
})()
