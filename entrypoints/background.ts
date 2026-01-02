import OpenAI from "openai";
export default defineBackground(() => {
  var contextText = '';
  try{
    browser.contextMenus.create({
      id: 'Rumia',
      title: 'Define (Rumia)',
      contexts: ['selection'],
    });
  }catch(error){
    console.error('Error creating context menu', error);
  }
  
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const res = await browser.scripting.executeScript({
      target: { tabId: tab?.id as number },
      files: ['content-scripts/getSelection.js']
    })
    contextText = res[0].result as string;
    console.log('contextText', contextText);
    browser.tabs.query({ active: true, currentWindow: true })
    .then(([tab]) => {
      if (tab?.id) {
        setTimeout(() => {
          if (tab?.id) {
            browser.tabs.sendMessage(tab.id, { 
            type: 'name-studio', 
              text: info.selectionText,
              answer: ''
            });
          }
        }, 100);
        async function getDefinition(word: string) {
          const groqApiKey = await browser.storage.local.get('groqApiKey').then((result) => {
            return result.groqApiKey as string;
          });
          const geminiApiKey = await browser.storage.local.get('geminiApiKey').then((result) => {
            return result.geminiApiKey as string;
          });
          var api_key_to_use = '';
          var base_url = '';
          var model_to_use = '';
          if (groqApiKey){
            api_key_to_use = groqApiKey;
            base_url = "https://api.groq.com/openai/v1";
            model_to_use = "openai/gpt-oss-120b";
          }else{
            api_key_to_use = '';
          }
          const openai = new OpenAI({
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
          
          const simple_context = contextText.split('.').filter((val)=>val.includes(word as string))[0];
          try{
            const stream = await openai.responses.create({
              model: model_to_use,
              input: `- Provide a definition for the following word, keep it short and concise less than 20 words: ${info.selectionText} 
              Follow this system prompt: ${systemPrompt.systemPrompt} 
              Also give another paragraph for how its used in this context: ${simple_context}
              Use this format:
              Definition: <definition>
              Usage: <usage>`,
              stream: true,
            });
            var answer = '';
            for await (const chunk of stream) {
              if (!isStreaming) break;
              if (chunk.type === 'response.output_text.delta') {
                answer = answer + chunk.delta;
                if (tab?.id) {
                  try{
                    browser.tabs.sendMessage(tab.id, { 
                      type: 'name-studio-definition', 
                      text: info.selectionText?.toString() || '',
                      answer: answer
                    });
                  }catch(error){
                    console.error('Error sending message', error);
                  }
                }
              }
              if (chunk.type === 'response.output_item.done') {
                if (tab?.id) {
                  try{
                    browser.tabs.sendMessage(tab.id, { 
                    type: 'name-studio-definition', 
                    text: info.selectionText,
                    answer: answer
                  });
                  }catch(error){
                    console.error('Error sending message', error);
                  }
                }
              }
            }
          }catch(error : any){
            console.log('Error creating stream', error);
            if (tab?.id) {
              browser.tabs.sendMessage(tab.id, { 
                type: 'name-studio-definition', 
                text: info.selectionText,
                answer: 'Error: ' + error.message
              });
            }
            return;
          }
        }
        getDefinition(info.selectionText as string);

            
      }
    });

    // browser.runtime.onMessage.addListener(async (message) => {
    //   if (message.type === 'check-api-key') {
    //     const groqApiKey = await browser.storage.local.get('groqApiKey').then((result) => {
    //       return result.groqApiKey as string;
    //     });
    //     const openai = new OpenAI({
    //       apiKey: groqApiKey,
    //       baseURL: "https://api.groq.com/openai/v1",
    //     });
    //     try{
    //       await openai.models.list();
    //       return true;
    //     }catch(error){
    //       return false;
    //     }
    //   }
    // });
  });
});
