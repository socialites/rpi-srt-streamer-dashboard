import type { Network, SystemStatus } from '../types';

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

export async function restartService(service: 'network-watcher' | 'srt-streamer' | 'camlink' | 'ap') {
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

export async function getNetworks(): Promise<Network[]> {
    try {
        const response = await fetch('/api/wifi/networks')
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return await response.json();
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to fetch networks: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function connectToNetwork(ssid: string, password: string) {
    try {
        const response = await fetch('/api/wifi/connect', {
            method: 'POST',
            body: JSON.stringify({ ssid, password }),
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to connect to network: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function disconnectFromNetwork(ssid: string) {
    try {
        const response = await fetch('/api/wifi/disconnect', {
            method: 'POST',
            body: JSON.stringify({ ssid }),
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to disconnect from network: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function forgetNetwork(ssid: string) {
    try {
        const response = await fetch('/api/wifi/forget', {
            method: 'POST',
            body: JSON.stringify({ ssid }),
        })
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.ok;
    } catch (error) {
        console.error(error)
        throw new Error(`Failed to forget network: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}