import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "../assets/ui.tsx";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    let container: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;
    let mouseX = 0;
    let mouseY = 0;
    function mouseMoveListener(event: MouseEvent) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    document.addEventListener('mousemove', mouseMoveListener);

    browser.runtime.onMessage.addListener((message) => {
      document.removeEventListener('mousemove', mouseMoveListener);
      if (root && container) {
        root.unmount();
        container.remove();
        root = null;
        container = null;
      }

      container = document.createElement("div");
      container.style.position = "fixed";
      container.style.zIndex = "10000";
      document.body.appendChild(container);

      root = ReactDOM.createRoot(container);
      root.render(React.createElement(Popup, { word: message.text, definition: "", mouseX: mouseX, mouseY: mouseY, handleClickOutside: () => handleClickOutside(new MouseEvent('mousedown')) }));
      browser.runtime.onMessage.addListener((message) => {
        if (root && message.type === 'name-studio-definition') {
          root.render(React.createElement(Popup, { word: message.text, definition: message.answer, mouseX: mouseX, mouseY: mouseY, handleClickOutside: () => handleClickOutside(new MouseEvent('mousedown')) }));
        }
      });

      function handleClickOutside(event: MouseEvent) {
        if (container){
          browser.runtime.sendMessage({
            type: 'stop-streaming'
          });
        }
        if (container && !container.contains(event.target as Node)) {
          root?.unmount();
          container.remove();
          root = null;
          container = null;
          document.removeEventListener("mousedown", handleClickOutside);
        }
        document.removeEventListener('mousemove', mouseMoveListener);
      }

      document.addEventListener("mousedown", handleClickOutside);
    });
  },
});
