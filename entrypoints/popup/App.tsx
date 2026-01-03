import "@/assets/tailwind.css";
import { useState, useEffect } from 'react';
import eye from '../../assets/eye.svg';
import eyeOpen from '../../assets/eye-open.svg';

function App() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [groqKeyVisible, setGroqKeyVisible] = useState(false);
  useEffect(() => {
    browser.storage.local.get(['geminiApiKey', 'groqApiKey', 'systemPrompt'], (result) => {
      setGeminiApiKey(result.geminiApiKey as string || '');
      setGroqApiKey(result.groqApiKey as string || '');
      setSystemPrompt(result.systemPrompt as string || '');
    });
  }, []);
  const handleGroqKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      browser.storage.local.set({ groqApiKey: event.currentTarget.value });
    }
  };
  const handleSystemPromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      console.log('System Prompt: ', event.currentTarget.value);
      browser.storage.local.set({ systemPrompt: event.currentTarget.value });
    }
  };

  const handleSaveConfiguration = () => {
    browser.storage.local.set({ geminiApiKey: geminiApiKey, groqApiKey: groqApiKey, systemPrompt: systemPrompt });
  };

  const handleToggleGroqKey = () => {
    setGroqKeyVisible(!groqKeyVisible);
  };

  return (
    <div className="bg-black/95 w-70 h-100 overflow-y-auto px-2">
      <div className="flex flex-col py-2 px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* <img src={icon} alt="logo" className="w-6 h-6 border border-white/10 rounded-md" /> */}
          <h1 className='text-xl font-bold text-white font-sans'>
            Rumia
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className=" rounded-md p-1">
          <div className="p-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="name" className="text-white font-sans text-xs font-medium">Groq Api Key</label>
              <span className="flex items-center gap-1"> 
                <a href="https://groq.com/" target="_blank" className="text-blue-300 font-sans font-extralight text-[10px] hover:underline">
                  Get Key
                </a>
                </span>
            </div>
            <div>
              <div className="w-full border border-white/3 rounded-xl bg-white/5 flex items-center gap-1 px-2">
                {/* <img alt="lock" className="w-4 h-4 cursor-pointer" /> */}
                <input type={groqKeyVisible ? 'text' : 'password'} value={groqApiKey} onChange={(e) => setGroqApiKey(e.target.value)} onKeyDown={handleGroqKeyDown} className="w-full p-2 rounded-md text-white border-0 bg-transparent border-white/50 focus:outline-none" />
                <div className="w-5 h-5 cursor-pointer flex items-center justify-center" onClick={handleToggleGroqKey}>
                  <img alt="eye" src={groqKeyVisible ? eyeOpen : eye} className="w-3 h-3 cursor-pointer filter invert" onClick={handleToggleGroqKey} />
                </div>
              </div>
              {/* <div className="px-1 py-1">
                <span className="text-white/30 font-extralight text-xs">keys are stored locally on your device</span>
              </div> */}
            </div>
            
          </div>
        </div>
        <div className="px-1 rounded-md py-2">
          <div className="px-2 flex flex-col gap-2">
            <label htmlFor="name" className="text-white font-sans text-xs font-medium">System Prompt</label>
            <div className="w-full border border-white/3 rounded-xl bg-white/5 flex items-center gap-1 px-1 text-white">
              <textarea rows={7} placeholder="enter your system prompt here ..." value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} onKeyDown={handleSystemPromptKeyDown} className="w-full p-2 rounded-md focus:outline-none font-extralight font-sans resize-none" />
            </div>
          </div>
        </div>
        <div className="py-2 px-3">
            <button onClick={handleSaveConfiguration} className="w-full border border-white/3 bg-white/5 text-white/50 px-4 py-2 rounded-xl hover:bg-white/15 cursor-pointer transition-all duration-300">Save Configuration</button>
        </div>
      </div>

      {/* <div className="flex items-center py-2 px-4 my-2 border-t border-white/10">
        <div className="text-white font-sans text-md">Previous Words</div>
        <div className="flex flex-col gap-2"> </div>
      </div> */}
    </div>
  );
}

export default App;
