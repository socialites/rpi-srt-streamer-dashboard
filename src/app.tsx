import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'preact/hooks';
import { Slide, ToastContainer } from 'react-toastify';
import { getSystemStatus } from './apis';
import './app.css';
import { ControlButtons } from './components/ControlButtons';
import { NetworkStatus } from './components/NetworkStatus';
import StreamPreview from './components/StreamPreview';
import { SystemStatus } from './components/SystemStatus';

export function App() {

  const { data: systemStatus, refetch, isError, error } = useQuery({
    queryKey: ['systemStatus'],
    placeholderData: {
      hostname: window.location.hostname,
      ip: "Fetching...",
      network_watcher: 'Fetching...',
      srt_streamer: 'Fetching...',
      ap_ssid: 'Fetching...',
      ap_status: 'Fetching...',
    },
    queryFn: getSystemStatus,
    refetchInterval: 10000,
  })

  const [streamPreview, setStreamPreview] = useState<boolean>(false);

  const toggleStreamPreview = useCallback(() => {
    setStreamPreview(!streamPreview);
  }, [streamPreview]);

  return (
    <div class="flex flex-col gap-2 max-w-md items-center justify-center">
        <ToastContainer
            position="top-right"
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
        <SystemStatus systemStatus={systemStatus} isError={isError} />
        <NetworkStatus />
        {streamPreview && <StreamPreview />}
        <ControlButtons refetch={refetch} toggleStreamPreview={toggleStreamPreview} />

        {isError && <p class="text-center text-sm text-red-500">Error: {error.message}</p>}
    </div>
  )
}
