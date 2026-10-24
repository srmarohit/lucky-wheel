/** Fixed red arrow on the right edge of the wheel that marks the winner. */
export function WheelPointer() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 right-[-15px] z-10 h-0 w-0 -translate-y-1/2 border-y-[15px] border-r-[30px] border-y-transparent border-r-accent drop-shadow-[-2px_0_4px_rgba(0,0,0,0.3)]"
    />
  );
}
