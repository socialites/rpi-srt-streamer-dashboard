import { toast } from 'react-toastify';
import { reboot, restartInstallAndStream, restartService, shutdown } from '../apis';
import { SplitButtons } from './SplitButtons';
import { Button } from './button';

export function ControlButtons({ refetch, toggleStreamPreview }: { refetch: () => void, toggleStreamPreview: () => void }) {

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
        <div id="buttons" class="flex flex-col gap-2">
            <Button className="bg-blue-500" onClick={toggleStreamPreview}>Toggle Stream Preview</Button>
            <Button className="bg-blue-500" onClick={() => refetch()}>Refresh Status</Button>
            <Button className="bg-yellow-500" onClick={() => restartService('network-watcher')}>Restart Network Watcher</Button>
            <Button className="bg-yellow-500" onClick={() => restartService('camlink')}>Restart Camlink</Button>
            <Button className="bg-yellow-500" onClick={() => restartService('srt-streamer')}>Restart SRT Streamer</Button>
            <Button className="bg-yellow-500" onClick={() => restartInstallAndStream()}>Restart Install and Stream</Button>
            <Button className="bg-red-500" onClick={() => promptReboot()}>Reboot</Button>
            <Button className="bg-red-500" onClick={() => promptShutdown()}>Shutdown</Button>
        </div>
    )
}