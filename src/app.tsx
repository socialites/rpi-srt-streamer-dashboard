import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useCallback, useState } from 'preact/hooks';
import { Slide, ToastContainer } from 'react-toastify';
import { getSystemStatus } from './apis';
import './app.css';
import { ControlButtons } from './components/ControlButtons';
import { NetworkManager } from './components/NetworkManager';
import { NetworkStatus } from './components/NetworkStatus';
import StreamPreview from './components/StreamPreview';
import { SystemStatus } from './components/SystemStatus';
import type { ScreenSizes } from './types';

export function App() {
    const [showNetworkManager, setShowNetworkManager] = useState<boolean>(false);

    const screen = new URLSearchParams(window.location.search).get('screen') as ScreenSizes;

  const { data: systemStatus, refetch, isError, error } = useQuery({
    queryKey: ['systemStatus'],
    placeholderData: {
      hostname: window.location.hostname,
      ip: "Fetching...",
      network_watcher: 'Fetching...',
      srt_streamer: 'Fetching...',
      ap_ssid: 'Fetching...',
      ap_status: 'Fetching...',
      ap_password: 'not available',
    },
    queryFn: getSystemStatus,
    refetchInterval: 10000,
  })

  const [streamPreview, setStreamPreview] = useState<boolean>(false);

  const toggleStreamPreview = useCallback(() => {
    setStreamPreview(!streamPreview);
  }, [streamPreview]);

  const toggleNetworkManager = useCallback(() => {
    setShowNetworkManager(!showNetworkManager);
  }, [showNetworkManager]);

  return (
    <div class={classNames("flex flex-col gap-2 items-center justify-center", {
        'max-w-md w-full py-16 px-4': screen === null,
        'max-w-xs w-xs px-2': screen === '0350',
    })}>
        <ToastContainer
            position={screen === '0350' ? "top-center" : "top-right"}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
        />
        <SystemStatus systemStatus={systemStatus} isError={isError} screen={screen} />
        <NetworkStatus />
        {showNetworkManager && <NetworkManager toggleNetworkManager={toggleNetworkManager} />}
        {streamPreview && <StreamPreview />}
        <ControlButtons refetch={refetch} toggleStreamPreview={toggleStreamPreview} toggleNetworkManager={toggleNetworkManager} />

        {isError && <p class="text-center text-sm text-red-500">Error: {error.message}</p>}
    </div>
  )
}
