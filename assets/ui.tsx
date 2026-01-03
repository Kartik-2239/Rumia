import "@/assets/tailwind.css";
import React from "react";
import restart from "../assets/restart.svg";
import cross from "../assets/cross.svg";
import audio from "../assets/audio.svg";

type PopupProps = {
  word: string;
  definition: string;
  mouseX: number;
  mouseY: number;
  handleClickOutside: () => void;
  error: boolean;
};
const Popup: React.FC<PopupProps> = ({ word, definition, mouseX, mouseY, handleClickOutside, error = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [positionX, setPositionX] = useState(mouseX);
    const [positionY, setPositionY] = useState(mouseY);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [baseUrl, setBaseUrl] = useState('https://api.dictionaryapi.dev/api/v2/entries/en/');
    const [audioUrl, setAudioUrl] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        fetch(`${baseUrl}${word}`)
        .then(response => response.json())
        .then(data => {
            setAudioUrl(data[0].phonetics[0].audio);
        })
        .catch(error => {
            console.error('Error fetching audio', error);
            setAudioUrl('');
        });
    }, [word]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setOffsetX(e.clientX - rect.left);
        setOffsetY(e.clientY - rect.top);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            setPositionX(e.clientX - offsetX);
            setPositionY(e.clientY - offsetY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offsetX, offsetY]);
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
    const handleReDefine = () => {
        browser.runtime.sendMessage({ type: 're-define', word: word, previous_definition: definition });
    }
    const handleAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.play();
    }
    return (
        <>
        <link rel="stylesheet" href="~/assets/tailwind.css" />
        <div
            ref={popupRef}
            className="underline-none w-100 h-60 fixed bg-black/70 border border-white/10 backdrop-blur-md text-white flex flex-col rounded-md shadow-gray-900 shadow-sm"
            style={{ left: positionX, top: positionY }}
            onClick={(e) => e.stopPropagation()}
        >   
            <div onMouseDown={handleMouseDown} className="w-full cursor-move bg-black/10 flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="text-white text-sm border-0 font-sans font-bold">Rumia</div>
                <div className="flex items-center gap-2">
                    <span onClick={handleReDefine} className="text-white text-sm border-0 select-none cursor-pointer rounded-md p-1 w-5 h-5 flex items-center justify-center">
                        <img src={restart} alt="info" className="w-4 h-4 filter invert" />
                    </span>
                    <span onClick={closePopup} className="text-white text-sm border-0 select-none cursor-pointer rounded-md p-0 w-5 h-5 flex items-center justify-center">
                        <img src={cross} alt="info" className="w-5 h-5 filter invert" />
                    </span>
                </div>
                
            </div>
            <div className="px-4 py-2 gap-2 flex flex-col overflow-y-auto">
                <div className="flex items-center flex-row gap-2">
                    <div className="text-2xl font-bold no-underline font-sans">{word.charAt(0).toUpperCase() + word.slice(1)}</div>
                    <div className="flex items-center justify-center pt-1 cursor-pointer">
                        {audioUrl ? <audio src={audioUrl} ref={audioRef} /> : <></>}
                        {audioRef.current ? <img onClick={handleAudio} src={audio} alt="" className="w-6 h-6 pb-1 filter invert" /> : <></>}
                    </div>
                </div>
                
                {error ? (
                    <div className="flex flex-col gap-0">
                        <p className="text-red-500 text-md font-bold font-mono">Error</p>
                        <p className="text-red-500 text-md font-sans">{definition}</p>
                    </div>
                ) : (
                    <>
                    <div className="flex flex-col gap-0">
                        <p className="text-white/80 text-sm font-bold font-mono">Definition</p>
                        <p className="text-white/50 text-sm font-sans">{definition? definition.split('Usage:')[0].split('Definition:')[1] : 'Loading...'}</p>
                    </div>
                    <div className="flex flex-col gap-0">
                        <p className="text-white/80 text-sm font-bold font-mono">Usage here</p>
                        <p className="text-white/50 text-sm font-sans">{definition? definition.split('Usage:')[1] : 'Loading...'}</p>
                    </div>
                    </>
                )}
                
            </div>
        </div>
        </>
    );
}

export default Popup;
