export type SystemStatus = {
    hostname: string;
    ip: string;
    network_watcher: string;
    srt_streamer: string;
    ap_ssid: string;
    ap_status: "up" | "down" | "Fetching...";
}

export interface NetworkStatus {
    [key: string]: { in_kbps: number, out_kbps: number };
}
