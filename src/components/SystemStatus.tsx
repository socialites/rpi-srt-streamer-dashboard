import classNames from "classnames";
import type { SystemStatus as SystemStatusType } from "../types";

export function SystemStatus({ systemStatus, isError }: { systemStatus: SystemStatusType | undefined, isError: boolean }) {

    return (
        <>
            <h1 class="text-4xl font-bold">{systemStatus?.hostname.toUpperCase() || window.location.hostname.toUpperCase()}</h1>
            {isError || systemStatus === undefined ? <p class="text-center text-sm text-red-500">Error occurred while fetching system status. See below for more details.</p> : (
                <>
                    <p class="font-mono text-sm flex flex-col flex-wrap gap-1 text-center"><strong>IP(s):</strong> {systemStatus?.ip.split(' ').map(ip => <span class="font-mono text-sm">{ip}</span>)}</p>
                    <p><strong>Network Watcher Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.network_watcher === "active" ? "text-green-500" : systemStatus?.network_watcher === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.network_watcher.toUpperCase()}</span></p>
                    <p><strong>SRT Streamer Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.srt_streamer === "active" ? "text-green-500" : systemStatus?.srt_streamer === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.srt_streamer.toUpperCase()}</span></p>
                    <p><strong>Access Point SSID:</strong> <span class="font-mono text-sm">{systemStatus?.ap_ssid}</span></p>
                    <p><strong>Access Point Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.ap_status === "up" ? "text-green-500" : systemStatus?.ap_status === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.ap_status.toUpperCase()}</span></p>
                </>
            )}
         </>
    )
}