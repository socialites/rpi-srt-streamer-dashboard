import classNames from "classnames";
import { useCallback, useState } from 'preact/hooks';
import { toast } from 'react-toastify';
import type { SystemStatus as SystemStatusType } from "../types";
import { unsecuredCopyToClipboard } from '../utils';

export function SystemStatus({ systemStatus, isError }: { systemStatus: SystemStatusType | undefined, isError: boolean }) {

    const [showApPassword, setShowApPassword] = useState(false);

    const toggleApPassword = useCallback(() => {
        if (systemStatus?.ap_password && systemStatus.ap_password !== 'not available') {
            setShowApPassword(!showApPassword);
        } else {
            toast.error('Access point password not available');
        }
    }, [showApPassword, systemStatus?.ap_password]);

    const copyToClipboard = useCallback(() => {
        if (!systemStatus?.ap_password || systemStatus.ap_password === 'not available') {
            toast.error('Access point password not available');
            return;
        }

        if (!window.isSecureContext) {
            try {
                unsecuredCopyToClipboard(systemStatus.ap_password);
                toast.success('Access point password copied to clipboard');
            } catch (error) {
                toast.error('Unable to copy to clipboard');
            }
        }

        if (window.isSecureContext && navigator.clipboard) {
            try {
                navigator.clipboard.writeText(systemStatus.ap_password);
                toast.success('Access point password copied to clipboard');
            } catch (error) {
                toast.error('Unable to copy to clipboard');
            }
        }
    }, [systemStatus?.ap_password]);

    return (
        <>
            <h1 class="text-4xl font-bold">{systemStatus?.hostname.toUpperCase() || window.location.hostname.toUpperCase()}</h1>
            {isError || systemStatus === undefined ? <p class="text-center text-sm text-red-500">Error occurred while fetching system status. See below for more details.</p> : (
                <>
                    <p class="font-mono text-sm flex flex-col flex-wrap gap-1 text-center"><strong>IP(s):</strong> {systemStatus?.ip.split(' ').map(ip => <span class="font-mono text-sm">{ip}</span>)}</p>
                    <p><strong>Network Watcher Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.network_watcher === "active" ? "text-green-500" : systemStatus?.network_watcher === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.network_watcher.toUpperCase()}</span></p>
                    <p><strong>SRT Streamer Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.srt_streamer === "active" ? "text-green-500" : systemStatus?.srt_streamer === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.srt_streamer.toUpperCase()}</span></p>
                    <p><strong>Access Point Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.ap_status === "up" ? "text-green-500" : systemStatus?.ap_status === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.ap_status.toUpperCase()}</span></p>
                    <p><strong>Access Point SSID:</strong> <span class="font-mono text-sm">{systemStatus?.ap_ssid}</span></p>
                    <p><strong>Access Point Password:</strong> <span class={classNames("font-mono text-sm", {
                        "bg-black text-black px-2 py-1 rounded-md": !showApPassword && systemStatus?.ap_password !== 'not available',
                        "bg-transparent text-white": showApPassword || systemStatus?.ap_password === 'not available',
                    })}>{systemStatus?.ap_password === 'not available' ? 'not available' : showApPassword ? systemStatus?.ap_password : '********'}</span></p>
                    <div class="flex flex-row gap-2 justify-center">{systemStatus?.ap_password !== 'not available' && <><button class="text-base text-blue-500 cursor-pointer border-2 rounded-md px-2 py-1 border-blue-500" onClick={toggleApPassword}>{showApPassword ? 'HIDE' : 'SHOW'}</button> <button class="text-base text-blue-500 cursor-pointer border-2 rounded-md px-2 py-1 border-blue-500" onClick={copyToClipboard}>COPY</button></>}</div>
                </>
            )}
         </>
    )
}