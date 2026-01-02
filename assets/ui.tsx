import "@/assets/tailwind.css";
import React from "react";

type PopupProps = {
  word: string;
  definition: string;
  mouseX: number;
  mouseY: number;
  handleClickOutside: () => void;
};
const Popup: React.FC<PopupProps> = ({ word, definition, mouseX, mouseY, handleClickOutside }) => {
    const [positionX, setPositionX] = useState(mouseX);
    const [positionY, setPositionY] = useState(mouseY);
    const popupRef = useRef<HTMLDivElement>(null);
    const closePopup = () => {
        handleClickOutside();
    }
    useEffect(() => {
        if (!popupRef.current) return;
        
        const popupWidth = popupRef.current.clientWidth;
        const popupHeight = popupRef.current.clientHeight;
        
        const x = Math.min(
            Math.max(0, mouseX),
            window.innerWidth - popupWidth
        );
        
        const y = Math.min(
            Math.max(0, mouseY),
            window.innerHeight - popupHeight
        );
        
        setPositionX(x);
        setPositionY(y);
    }, [mouseX, mouseY]);
    
    return (
        <div
            ref={popupRef}
            className="underline-none w-100 h-60 fixed bg-black/70 border border-white/10 backdrop-blur-md text-white flex flex-col rounded-md shadow-md"
            style={{ left: positionX, top: positionY-100 }}
            onClick={(e) => e.stopPropagation()}
        >   
            <div  className="w-full bg-black/10 flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="text-white text-sm border-0 font-sans">Rumia</div>
                <div className="flex items-center gap-2">
                    {/* <button onClick={handleReDefine}>♲</button> */}
                    <button onClick={closePopup} className="text-white text-sm border-0">X</button>
                </div>
                
            </div>
            <div className="px-4 py-2 gap-2 flex flex-col overflow-y-auto">
                <div className="text-2xl font-bold no-underline font-sans">{word.charAt(0).toUpperCase() + word.slice(1)}</div>
                <div className="flex flex-col gap-0">
                    <p className="text-white/80 text-sm font-bold font-mono">Definition</p>
                    <p className="text-white/50 text-sm font-sans">{definition? definition.split('Usage:')[0].split('Definition:')[1] : 'Loading...'}</p>
                </div>
                <div className="flex flex-col gap-0">
                    <p className="text-white/80 text-sm font-bold font-mono">Usage here</p>
                    <p className="text-white/50 text-sm font-sans">{definition? definition.split('Usage:')[1] : 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
}

export default Popup;
