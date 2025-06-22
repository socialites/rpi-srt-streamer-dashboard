export type SystemStatus = {
    hostname: string;
    ip: string;
    network_watcher: string;
    srt_streamer: string;
}

export interface NetworkStatus {
    [key: string]: { in_kbps: number, out_kbps: number };
}
