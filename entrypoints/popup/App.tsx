import "@/assets/tailwind.css";
import { useState, useEffect } from 'react';

function App() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
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
      checkApiKey().then((res) => {
        if (!res) {
          alert('Invalid API key, please try again');
          browser.storage.local.set({ groqApiKey: '' });
        }
      });
    }
  };
  const handleSystemPromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      console.log('System Prompt: ', event.currentTarget.value);
      browser.storage.local.set({ systemPrompt: event.currentTarget.value });
    }
  };

  const checkApiKey = async () => {
    const res = await browser.runtime.sendMessage({ type: 'check-api-key' });
    if (res) {
      return true;
    }
    return false;
  };
  return (
    <div className="bg-black/90 w-70 h-100 overflow-y-auto px-2">
      <div className="flex items-center py-2 px-4 border-b border-white/10">
        <h1 className='text-2xl text-white font-sans'>
          Rumia
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <div className=" rounded-md p-1">
          {/* <div className="p-2 flex flex-col gap-2">
            <div className="">
              <label htmlFor="name" className="text-white font-sans">Gemini Api Key</label>
              <span className="text-white/30 text-xs"> (get one from <a href="https://ai.studio/" target="_blank" className="text-blue-300 underline">here</a>)</span>
            </div>
            <input placeholder="coming soon.." value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} onKeyDown={handleGeminiKeyDown} type="password" className="w-full p-2 rounded-md cursor-not-allowed text-white border border-white/50 focus:outline-none" />
          </div> */}
          <div className="p-2 flex flex-col gap-2">
            <div className="">
              <label htmlFor="name" className="text-white font-sans">Groq Api Key</label>
              <span className="text-white/30 text-xs"> (get one from <a href="https://groq.com/" target="_blank" className="text-blue-300 underline">here</a>)</span>
            </div>
            <input value={groqApiKey} type="password" onChange={(e) => setGroqApiKey(e.target.value)} onKeyDown={handleGroqKeyDown} className="w-full p-2 rounded-md text-white border border-white/50 focus:outline-none" />
          </div>
        </div>
        <div className=" rounded-md px-1 py-2">
          <div className="px-2 flex flex-col gap-2">
            <label htmlFor="name" className="text-white font-sans">System Prompt</label>
            <textarea rows={5} placeholder="click enter to save system prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} onKeyDown={handleSystemPromptKeyDown} className="w-full p-2 rounded-md text-white border border-white/50 focus:outline-none" />
          </div>
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
