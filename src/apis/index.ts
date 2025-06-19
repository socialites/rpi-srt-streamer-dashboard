import type { SystemStatus } from '../../types'

export async function getSystemStatus() {
    try {
        const response = await fetch('/api/system-status')
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return await response.json() as SystemStatus
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to fetch system status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}