import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "preact/hooks";
import { toast, type ToastContentProps } from 'react-toastify';
import { connectToNetwork, getNetworks } from "../apis";
import { Modal } from './Modal';
import { Button } from './button';

const promptId = 'connect-to-network-prompt';

export function NetworkManager({ toggleNetworkManager }: { toggleNetworkManager: () => void }) {
    const { data: networks, isError, error, refetch } = useQuery({
        queryKey: ['networks'],
        queryFn: getNetworks,
        refetchInterval: 5000,
    });

    const promptConnectToNetwork = useCallback((SSID: string) => {
        toast(Form, {
            toastId: promptId,
            data: {
                SSID,
            },
        })
    }, []);

    useEffect(() => {
        if (isError) {
            toast.error(error.message);
        }
    }, [isError, error]);

    return (
        <Modal onPress={toggleNetworkManager}>
            <div class="bg-white p-4 rounded-md w-full h-full flex flex-col gap-2 text-black z-10 xl:max-w-lg xl:max-h-1/2 max-h-5/6" onClick={e => e.stopPropagation()}>
                <h1 class="text-2xl font-bold">Network Manager</h1>
                <h2 class="text-lg font-bold">Networks</h2>
                <div class="flex flex-col gap-2 overflow-y-auto  h-full">
                    {networks && networks.length && networks?.map((network) => (
                        <Button className={`bg-blue-500 text-white p-2 rounded-md ${network.in_use ? 'bg-green-500' : ''}`} onClick={() => promptConnectToNetwork(network.ssid)}>
                            <div class="flex flex-col gap-2">
                                <p>{network.ssid} {network.in_use && '(Connected)'}</p>
                                <div class="flex flex-row gap-2 text-xs">
                                    <p>Speed: {network.rate}</p>
                                    <p>Signal Strength: {network.signal}</p>
                                </div>
                            </div>
                        </Button>
                    ))}
                    {
                        (!networks || networks?.length === 0) && (
                            <div>No networks found</div>
                        )
                    }
                </div>
                <div class="flex flex-col gap-2">
                    <Button className="bg-yellow-500 text-white p-2 rounded-md" onClick={() => refetch()}>Re-scan</Button>
                    <Button className="bg-red-500 text-white p-2 rounded-md" onClick={() => toggleNetworkManager()}>Cancel</Button>
                </div>
            </div>
        </Modal>
    )
}

function Form({ data, closeToast }: ToastContentProps<{ SSID: string }>) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = useCallback(async() => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        try {
            await connectToNetwork(data.SSID, password);
            closeToast();
        } catch (error) {
            setError('Failed to connect to network');
        }
    }, [password, data.SSID, closeToast]);

    return (
      <div className="flex flex-col w-full gap-2">
        <h3 className="text-zinc-800 text-sm font-semibold">Connect to {data.SSID}</h3>
        <p className="text-sm">Enter the password for {data.SSID}</p>
        <form>
          <input type="password" className="w-full border border-purple-600/40 rounded-md resize-none h-[100px]" value={password} onChange={e => setPassword((e.target as HTMLInputElement).value)} />
        </form>
        <Button onClick={handleSubmit}>Submit</Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }