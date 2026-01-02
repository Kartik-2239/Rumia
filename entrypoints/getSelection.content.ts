export default defineContentScript({
    registration: "runtime",
    main() {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const parentElement = range?.commonAncestorContainer.parentElement;
        if (parentElement) {
            return parentElement?.innerText.toString() || '';
        }
        return '';
    }
});