export type SystemStatus = {
    hostname: string;
    ip: string;
    network_watcher: string;
    srt_streamer: string;
    ap_ssid: string;
    ap_status: "up" | "down" | "missing" | "Fetching...";
    ap_password: "not available" | string;
}

export type Network = {
    ssid: string;
    in_use: boolean;
    rate: string;
    signal: number;
    security: string;
}

export interface NetworkStatus {
    [key: string]: { in_kbps: number, out_kbps: number };
}
