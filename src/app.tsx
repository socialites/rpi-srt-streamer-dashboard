import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Slide, toast, ToastContainer, type ToastContentProps } from 'react-toastify';
import { getSystemStatus, reboot, restartInstallAndStream, restartService, shutdown } from './apis';
import './app.css';
import { Button } from './components/button';

export function App() {

  const { data: systemStatus, refetch, isError, error } = useQuery({
    queryKey: ['systemStatus'],
    placeholderData: {
      hostname: window.location.hostname,
      ip: "Fetching...",
      network_watcher: 'Fetching...',
      srt_streamer: 'Fetching...',
    },
    queryFn: getSystemStatus,
    refetchInterval: 10000,
  })

  const promptReboot = () => {
    toast(<SplitButtons
        onConfirm={() => reboot()}
        onCancel={() => toast.dismiss('reboot-prompt')}
        title="Reboot"
        message="Are you sure you want to reboot?" />, {
            toastId: 'reboot-prompt',
            type: 'error',
            closeButton: false,
            closeOnClick: false,
            className: 'p-0 w-[400px] border border-red-600/40',
        }
    )
  }

  const promptShutdown = () => {
    toast(<SplitButtons
        onConfirm={() => shutdown()}
        onCancel={() => toast.dismiss('shutdown-prompt')}
        title="Shutdown"
        message="Are you sure you want to shutdown?" />, {
            toastId: 'shutdown-prompt',
            type: 'error',
            closeButton: false,
            closeOnClick: false,
            className: 'p-0 w-[400px] border border-red-600/40',
        }
    )
  }

  return (
    <>
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
      <h1 class="text-4xl font-bold">{systemStatus?.hostname.toUpperCase() || window.location.hostname.toUpperCase()}</h1>
      <p class="font-mono text-sm flex flex-col flex-wrap gap-1 text-center"><strong>IP(s):</strong> {systemStatus?.ip.split(' ').map(ip => <span class="font-mono text-sm">{ip}</span>)}</p>
      <p><strong>Network Watcher Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.network_watcher === "active" ? "text-green-500" : systemStatus?.network_watcher === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.network_watcher.toUpperCase()}</span></p>
      <p><strong>SRT Streamer Status:</strong> <span class={classNames("font-mono text-sm", systemStatus?.srt_streamer === "active" ? "text-green-500" : systemStatus?.srt_streamer === 'Fetching...' ? "text-yellow-500" : "text-red-500")}>{systemStatus?.srt_streamer.toUpperCase()}</span></p>

      <div id="buttons" class="flex flex-col gap-2">
        <Button className="bg-blue-500" onClick={() => refetch()}>Refresh Status</Button>
        <Button className="bg-yellow-500" onClick={() => restartService('network-watcher')}>Restart Network Watcher</Button>
        <Button className="bg-yellow-500" onClick={() => restartService('camlink')}>Restart Camlink</Button>
        <Button className="bg-yellow-500" onClick={() => restartService('srt-streamer')}>Restart SRT Streamer</Button>
        <Button className="bg-yellow-500" onClick={() => restartInstallAndStream()}>Restart Install and Stream</Button>
        <Button className="bg-red-500" onClick={() => promptReboot()}>Reboot</Button>
        <Button className="bg-red-500" onClick={() => promptShutdown()}>Shutdown</Button>
      </div>
      <div id="logs" class="flex flex-col gap-2">
        {isError && <p>Error: {error.message}</p>}
      </div>
    </>
  )
}

function SplitButtons({ onConfirm, onCancel, title, message }: Partial<ToastContentProps> & { onConfirm: () => void, onCancel: () => void, title: string, message: string }) {
    return (
      // using a grid with 3 columns
      <div className="grid grid-cols-[1fr_1px_80px] w-full">
        <div className="flex flex-col p-4">
          <h3 className="text-white text-sm font-semibold">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
        {/* that's the vertical line which separate the text and the buttons*/}
        <div className="bg-white/10 h-full" />
        <div className="grid grid-rows-[1fr_1px_1fr] h-full">
          {/*specifying a custom closure reason that can be used with the onClose callback*/}
          <button onClick={() => onConfirm()} className="text-red-600">
            Confirm
          </button>
          <div className="bg-white/10 w-full" />
          {/*specifying a custom closure reason that can be used with the onClose callback*/}
          <button onClick={() => onCancel()}>Cancel</button>
        </div>
      </div>
    );
  }