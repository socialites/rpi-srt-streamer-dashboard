export function Modal({ children, onPress }: { children: preact.JSX.Element, onPress?: () => void }) {
    return (
        <div class="absolute top-0 left-0 w-full h-full bg-black/50 p-8 z-50 select-none flex justify-center items-center" onClick={onPress}>
            {children}
        </div>
    )
}