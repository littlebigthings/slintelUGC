let clipboard = new ClipboardJS('.copy-cta');
if(clipboard){
    clipboard.on('success', (e) => {
        e.trigger.innerHTML = "copied!"
        setTimeout(() => {
            e.trigger.innerHTML = "copy"
            e.clearSelection();
        }, 5000);
    });
    
    clipboard.on('error', (e) => {
        e.trigger.innerHTML = "try again!"
    });
}