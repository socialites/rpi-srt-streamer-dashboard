import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Signal, SignalHigh, SignalLow, SignalMedium, SignalZero, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "preact/hooks";
import { toast, type ToastContentProps } from 'react-toastify';
import { connectToNetwork, disconnectFromNetwork, forgetNetwork, getNetworks } from "../apis";
import { Button } from './button';
import { Modal } from './Modal';
import { SplitButtons } from './SplitButtons';

const connectPromptId = 'connect-to-network-prompt';
const disconnectPromptId = 'disconnect-from-network-prompt';
const forgetNetworkPromptId = 'forget-network-prompt';

const SignalIcon = ({ signal, className }: { signal: number, className?: string }) => {
    if (signal >= 90) return <Signal className={className} />;
    if (signal > 75) return <SignalHigh className={className} />;
    if (signal > 50) return <SignalMedium className={className} />;
    if (signal > 25) return <SignalLow className={className} />;
    return <SignalZero className={className} />;
};

export function NetworkManager({ toggleNetworkManager }: { toggleNetworkManager: () => void }) {
    const { data: networks, isError, error, refetch } = useQuery({
        queryKey: ['networks'],
        queryFn: getNetworks,
        refetchInterval: 5000,
    });

    const promptConnectToNetwork = useCallback((SSID: string) => {
        toast(<Form onCancel={() => toast.dismiss(connectPromptId)} SSID={SSID} />, {
            autoClose: false,
            toastId: connectPromptId,
            draggable: false,
        })
    }, []);

    const promptDisconnectFromNetwork = useCallback((SSID: string) => {
        toast(<SplitButtons
            onConfirm={() => disconnectFromNetwork(SSID)}
            onCancel={() => toast.dismiss(disconnectPromptId)}
            title={`Disconnect from ${SSID}`}
            message={`Are you sure you want to disconnect from ${SSID}?`} />, {
                toastId: disconnectPromptId,
                type: 'error',
                closeButton: false,
                closeOnClick: false,
                className: 'p-0 w-[400px] border border-red-600/40',
            }
        )
    }, []);

    const promptForgetNetwork = useCallback((SSID: string) => {
        toast(<SplitButtons
            onConfirm={() => forgetNetwork(SSID)}
            onCancel={() => toast.dismiss(forgetNetworkPromptId)}
            title={`Forget ${SSID}`}
            message={`Are you sure you want to forget ${SSID}?`} />, {
                toastId: forgetNetworkPromptId,
                type: 'error',
                closeButton: false,
                closeOnClick: false,
                className: 'p-0 w-[400px] border border-red-600/40',
            }
        )
    }, []);

    useEffect(() => {
        if (isError) {
            toast.error(error.message);
        }
    }, [isError, error]);


    return (
        <Modal onPress={toggleNetworkManager}>
            <div class="bg-slate-800 p-4 rounded-md w-full h-full flex flex-col gap-2 text-white z-10 xl:max-w-lg xl:max-h-1/2 max-h-5/6" onClick={e => e.stopPropagation()}>
                <h1 class="text-2xl font-bold">Network Manager</h1>
                <h2 class="text-lg font-bold">Networks</h2>
                <div class="flex flex-col gap-2 overflow-y-auto py-2 h-full">
                    {networks && networks.length && networks?.map((network) => (
                        <div class='w-full h-auto relative'>
                            <Button className={`bg-blue-500 text-white p-2 rounded-md w-full ${network.in_use ? 'bg-green-500' : ''}`} onClick={() => network.in_use ? promptDisconnectFromNetwork(network.ssid) : promptConnectToNetwork(network.ssid)}>
                                <div class="flex flex-col gap-2 items-start justify-start">
                                    <p>{network.ssid} {network.in_use && '(Connected)'}</p>
                                    <div class="flex flex-row gap-2 text-xs">
                                        <p>Speed: {network.rate}</p>
                                        <p>Signal Strength: <SignalIcon signal={network.signal} className="w-4 h-4" /></p>
                                        <p>{network.security}</p>
                                    </div>
                                </div>
                            </Button>
                            {network.in_use && (
                                <div class="absolute top-0 right-0 p-2">
                                    <Button className="bg-red-500 w-4 h-4 text-white text-xs !p-3 flex items-center justify-center rounded-md" onClick={() => promptForgetNetwork(network.ssid)}><Trash2 /></Button>
                                </div>
                            )}
                        </div>
                    ))}
                    {
                        (!networks || networks?.length === 0) && (
                            <div>No networks found</div>
                        )
                    }
                </div>
                <div class="flex flex-col gap-2">
                    <Button className="bg-yellow-500 text-white p-2 rounded-md flex items-center justify-center gap-2" onClick={() => refetch()}><RotateCcw className="w-4 h-4" /> Re-scan</Button>
                    <Button className="bg-red-500 text-white p-2 rounded-md" onClick={() => toggleNetworkManager()}>Cancel</Button>
                </div>
            </div>
        </Modal>
    )
}

function Form({ onCancel, SSID }: Partial<ToastContentProps> & { onCancel: () => void, SSID: string }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async() => {
        if (isLoading) return;
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        try {
            setIsLoading(true);
            await connectToNetwork(SSID, password);
            onCancel();
            setIsLoading(false);
        } catch (error) {
            setError('Failed to connect to network');
            setIsLoading(false);
        }
    }, [password, SSID, onCancel]);

    return (
      <div className="flex flex-col w-full gap-2">
        <h3 className="text-white text-sm font-semibold">Connect to {SSID}</h3>
        <p className="text-sm">Enter the password for {SSID}</p>
        <form>
          <input disabled={isLoading} type="password" className="w-full border border-purple-600/40 rounded-md resize-none" value={password} onChange={e => setPassword((e.target as HTMLInputElement).value)} />
        </form>
        <Button disabled={isLoading} className={`${isLoading ? 'bg-gray-500' : 'bg-blue-500'}`} onClick={handleSubmit}>{isLoading ? 'Connecting...' : 'Submit'}</Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }