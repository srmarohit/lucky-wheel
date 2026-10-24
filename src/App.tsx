import { InstallMenu } from "./components/InstallMenu";
import { PrizeControls } from "./components/PrizeControls";
import { PrizeList } from "./components/PrizeList";
import { Wheel } from "./components/Wheel";
import { WinnerModal } from "./components/WinnerModal";
import { useWheel } from "./hooks/useWheel";

export default function App() {
  const {
    prizes,
    rotation,
    isSpinning,
    winner,
    addPrize,
    removePrize,
    resetPrizes,
    spin,
    closeWinner,
  } = useWheel();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand to-brand-dark p-5">
      <InstallMenu />
      <main className="w-full max-w-[800px] rounded-[20px] bg-white p-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] max-sm:p-[15px]">
        <h1 className="mb-[30px] bg-linear-to-br from-brand to-brand-dark bg-clip-text text-center text-[2.5em] font-bold text-transparent max-sm:mb-5 max-sm:text-[1.8em]">
          🎯 Lucky Winner Spinner
        </h1>
        <Wheel
          prizes={prizes}
          rotation={rotation}
          isSpinning={isSpinning}
          onSpin={spin}
        />
        <PrizeControls onAdd={addPrize} onReset={resetPrizes} />
        <PrizeList prizes={prizes} onRemove={removePrize} />
      </main>
      <WinnerModal winner={winner} onClose={closeWinner} />
    </div>
  );
}
