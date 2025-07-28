import { useFocus } from "../stores/map";
import handleLocate from "../utils/handleLocate";

const LocateButton = ({ setUserLocation }) => {
  const { focus, setFocus } = useFocus();
  const handleLocateClick = () => {
    handleLocate(
      (location) => {
        setUserLocation(location);
        setFocus(true);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
    );
  };

  return (
    <div
      className="absolute z-[10] sm:bottom-6 sm:top-auto top-28 sm:left-10 left-2 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 group"
      onClick={handleLocateClick}
    >
      <div className="relative">
        <img
          src="/map_wave.svg"
          alt="locate"
          className="w-16 h-16 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default LocateButton;
