import { useQuery } from '@tanstack/react-query';
import { getSystemStatus, reboot, restartInstallAndStream, restartService } from './apis';
import './app.css';
import { Button } from './components/button';

export function App() {

  const { data: systemStatus, refetch, isError, error } = useQuery({
    queryKey: ['systemStatus'],
    placeholderData: {
      hostname: window.location.hostname,
      ip: 'Fetching...',
      network_watcher: 'Fetching...',
      srt_streamer: 'Fetching...',
    },
    queryFn: getSystemStatus,
    refetchInterval: 10000,
  })

  return (
    <>
      <h1 class="text-4xl font-bold">{systemStatus?.hostname.toUpperCase() || window.location.hostname.toUpperCase()}</h1>
      <p><strong>IP:</strong> {systemStatus?.ip}</p>
      <p><strong>Network Watcher Status:</strong> {systemStatus?.network_watcher}</p>
      <p><strong>SRT Streamer Status:</strong> {systemStatus?.srt_streamer}</p>

      <div id="buttons" class="flex flex-col gap-2">
        <Button className="bg-blue-500" onClick={() => refetch()}>Refresh Status</Button>
        <Button className="bg-yellow-500" onClick={() => restartService('network-watcher')}>Restart Network Watcher</Button>
        <Button className="bg-yellow-500" onClick={() => restartService('srt-streamer')}>Restart SRT Streamer</Button>
        <Button className="bg-yellow-500" onClick={() => restartInstallAndStream()}>Restart Install and Stream</Button>
        <Button className="bg-red-500" onClick={() => reboot()}>Reboot</Button>
        <Button className="bg-red-500" onClick={() => {}}>Shutdown</Button>
      </div>
      <div id="logs" class="flex flex-col gap-2">
        {isError && <p>Error: {error.message}</p>}
      </div>
    </>
  )
}
