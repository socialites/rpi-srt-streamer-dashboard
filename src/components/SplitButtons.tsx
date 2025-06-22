import type { ToastContentProps } from 'react-toastify';

export function SplitButtons({ onConfirm, onCancel, title, message }: Partial<ToastContentProps> & { onConfirm: () => void, onCancel: () => void, title: string, message: string }) {
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