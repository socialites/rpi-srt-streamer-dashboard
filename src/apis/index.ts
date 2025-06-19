import type { SystemStatus } from '../../types';

export async function getHealth() {
    try {
        const response = await fetch('/health')
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to fetch health: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function getSystemStatus() {
    try {
        const response = await fetch('/api/status')
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return await response.json() as SystemStatus
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to fetch system status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function restartService(service: 'network-watcher' | 'srt-streamer' | 'camlink') {
    try {
        const response = await fetch(`/api/restart/${service}`, {
            method: 'POST',
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to restart ${service}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function restartInstallAndStream() {
    try {
        const response = await fetch('/api/run-install', {
            method: 'POST',
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to restart install and stream: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function reboot() {
    try {
        const response = await fetch('/api/reboot', {
            method: 'POST',
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to reboot: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function shutdown() {
    try {
        const response = await fetch('/api/shutdown', {
            method: 'POST',
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to shutdown: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}