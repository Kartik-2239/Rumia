import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "../assets/ui.tsx";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  main(ctx: any) {
    let currentUi: any = null;
    let mouseX = 0;
    let mouseY = 0;
    function mouseMoveListener(event: MouseEvent) {
      // console.log('mouseMoveListener', event);
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
    document.addEventListener('mousemove', mouseMoveListener);
    
    browser.runtime.onMessage.addListener(async (message) => {

      let container: HTMLDivElement | null = null;
      let root: ReactDOM.Root | null = null;

      const ui = await createShadowRootUi(ctx, {
        name: 'rumia-content',
        position: 'overlay',
        inheritStyles: false,
        anchor: 'body',
        onMount: (container) => {
          document.removeEventListener('mousemove', mouseMoveListener);
          if (currentUi) {
            currentUi.remove();
          }
          currentUi = ui;
          
          const mountPoint = document.createElement("div");
          mountPoint.style.position = "fixed";
          mountPoint.style.zIndex = "10000";
          mountPoint.style.height = "240px";
          mountPoint.style.width = "400px";

          const shadowHost = container.getRootNode() as ShadowRoot;
          const hostElement = shadowHost.host as HTMLElement;
          
          function handleClickOutside(event: MouseEvent) {
            if (hostElement && !hostElement.contains(event.target as Node)) {
              ui.remove();
            }
            document.addEventListener('mousemove', mouseMoveListener);
          }
          
          container.appendChild(mountPoint);
          
          const root = ReactDOM.createRoot(mountPoint);
          root.render(React.createElement(Popup, { 
            word: message.text, 
            definition: message.answer, 
            mouseX: message.positionX>0 ? message.positionX : mouseX, 
            mouseY: message.positionY>0 ? message.positionY : mouseY,
            handleClickOutside: () => handleClickOutside(new MouseEvent('mousedown')), 
            error: false 
          }));
          
          document.addEventListener("mousedown", handleClickOutside);
        },
        onRemove: () => {
          if (root && container) {
            root.unmount();
            container.remove();
            root = null;
            container = null;
          }
        }
      })
      ui.mount();

      

      // document.addEventListener("mousedown", handleClickOutside);
    });
  },
});
