import classNames from 'classnames';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { NetworkStatus as NetworkStatusType } from "../types";

export function NetworkStatus() {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatusType | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let retryTimeout: number | null = null;
        let isRetrying = false;

        const connectWebSocket = () => {
            if (isRetrying) return;

            // Create WebSocket connection
            const ws = new WebSocket(`ws://${window.location.hostname}/api/network/ws`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connection opened');
                setIsConnected(true);
                setError(null);
                isRetrying = false;
            };

            ws.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data) as NetworkStatusType;
                    console.log('Network stats:', data);
                    setNetworkStatus(data);
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                    setError('Failed to parse network data');
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket connection error');
                setIsConnected(false);

                // Schedule retry if not already retrying
                if (!isRetrying) {
                    isRetrying = true;
                    retryTimeout = window.setTimeout(() => {
                        isRetrying = false;
                        connectWebSocket();
                    }, 1000);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
                setIsConnected(false);

                // Schedule retry if not already retrying
                if (!isRetrying) {
                    isRetrying = true;
                    retryTimeout = window.setTimeout(() => {
                        isRetrying = false;
                        connectWebSocket();
                    }, 1000);
                }
            };
        };

        // Start the initial connection
        connectWebSocket();

        // Cleanup function
        return () => {
            isRetrying = false;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
        };
    }, []); // Empty dependency array - only run once

    return (
        <div className="flex flex-col gap-2 items-center">

            {/* Connection status */}
            <div className="mb-2">
                <span className={classNames('font-bold', isConnected ? 'text-green-500' : 'text-red-500')}>
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </span>
                {error && <span className="text-red-500 ml-2">Error: {error}</span>}
            </div>

            {/* Network data display */}
            {networkStatus ? (
                <div class="flex flex-row gap-2">
                    {Object.entries(networkStatus).map(([interfaceName, stats]) => (
                        <div key={interfaceName} className="flex flex-col gap-2 border border-gray-300 rounded-md p-2">
                            <h3 className="text-sm font-bold">{interfaceName}</h3>
                            <p className="text-sm">In: {stats.in_kbps.toFixed(2)} kbps</p>
                            <p className="text-sm">Out: {stats.out_kbps.toFixed(2)} kbps</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No network data available</p>
            )}
        </div>
    );
}