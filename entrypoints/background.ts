// import OpenAI from "openai";
export default defineBackground(async () => {
  const OpenAI = await import('openai');
  var contextText = '';
  try{
    browser.contextMenus.create({
      id: 'Rumia',
      title: 'Define (Rumia)',
      contexts: ['selection'],
    });
  }catch(error){
    console.log('Error creating context menu', error);
  }
  
  browser.contextMenus.onClicked?.addListener(async (info, tab) => {
    const res = await browser.scripting.executeScript({
      target: { tabId: tab?.id as number },
      files: ['content-scripts/getSelection.js']
    })
    contextText = res[0].result as string;
    // console.log('contextText', contextText);
    browser.tabs.query({ active: true, currentWindow: true })
    .then(([tab]) => {
      if (tab?.id) {
        const word = info.selectionText?.split(' ')[0];
        if (tab?.id) {
          browser.tabs.sendMessage(tab.id, { 
          type: 'name-studio', 
            text: word,
            answer: ''
          });
        }
        const simple_context = contextText?.split('.').filter((val)=>val.includes(info.selectionText as string))[0];
        // console.log('simple_context', simple_context);
        getDefinition(word as string, simple_context, tab);
      }
    });

    browser.runtime.onMessage.addListener(async (message) => {
      if (message.type === 're-define') {
        const simple_context = contextText.split('.').filter((val)=>val.includes(message.word as string))[0];
        browser.tabs.query({ active: true, currentWindow: true })
        .then(([tab]) => {
          if (tab?.id) {
            getDefinition(message.word, simple_context, tab, message.previous_definition, message.mouseX, message.mouseY);
          }
        });
      }
    });
  });
  async function getDefinition(word: string, simple_context: string, tab: any, previous_definition?: string, mouseX?: number, mouseY?: number) {
    const groqApiKey = await browser.storage.local.get('groqApiKey').then((result) => {
      return result.groqApiKey as string;
    });
    const api_key_to_use = groqApiKey;
    const base_url = "https://api.groq.com/openai/v1";
    const model_to_use = "openai/gpt-oss-120b";
    const openai = new OpenAI.OpenAI({
      apiKey: api_key_to_use,
      baseURL: base_url,
    });
    const systemPrompt = await browser.storage.local.get('systemPrompt')
    var isStreaming = true;
    try{
      browser.runtime.onMessage.addListener((message) => {
        if (message.type === 'stop-streaming') {
          isStreaming = false
        }
      });
    }catch(error){
      console.error('Error creating context menu', error);
    }
    
    
    try{
      let input = `- Provide a definition for the following word, keep it short and concise less than 20 words: ${word} 
        Follow this system prompt: ${systemPrompt.systemPrompt} 
        Also give another paragraph for how its used in this context: ${simple_context}
        Use this format:
        Definition: <definition>
        Usage: <usage>`;
      if (previous_definition) {
        input = input + `\n\nPrevious definition was this and user was not satisfied with it: ${previous_definition}`;
      }
      const res = await openai.responses.create({
        model: model_to_use,
        input: input,
        // stream: true,
      });
      // var answer = '';
      if (tab?.id) {
        try{
          browser.tabs.sendMessage(tab.id, { 
            type: 'name-studio-definition', 
            text: word?.toString() || '',
            answer: res.output_text,
            positionX: mouseX || 0,
            mouseY: mouseY || 0
          });
        }catch(error){
          console.error('Error sending message', error);
        }
      }

      // for await (const chunk of stream) {
      //   if (!isStreaming) break;
      //   if (chunk.type === 'response.output_text.delta') {
      //     answer = answer + chunk.delta;
      //     console.log('answer', answer);
      //     if (tab?.id) {
      //       try{
      //         browser.tabs.sendMessage(tab.id, { 
      //           type: 'name-studio-definition', 
      //           text: word?.toString() || '',
      //           answer: answer
      //         });
      //       }catch(error){
      //         console.error('Error sending message', error);
      //       }
      //     }
      //   }
      //   if (chunk.type === 'response.output_item.done') {
      //     if (tab?.id) {
      //       try{
      //         browser.tabs.sendMessage(tab.id, { 
      //         type: 'name-studio-definition', 
      //         text: word,
      //         answer: answer
      //       });
      //       }catch(error){
      //         console.error('Error sending message', error);
      //       }
      //     }
      //   }
      // }
    }catch(error : any){
      console.log('Error creating stream', error);
      if (tab?.id) {
        browser.tabs.sendMessage(tab.id, { 
          error: true,
          type: 'name-studio-definition', 
          text: word,
          answer: 'Error: ' + error.message
        });
      }
      return;
    }
  }
});
