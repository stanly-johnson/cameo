// const fs = require('fs')
// const path = require('path')

// const inpageContent = fs.readFileSync(path.join(__dirname, 'build', 'static', 'js', 'main.b1ce4942.chunk.js'), 'utf8')
// const inpageSuffix = `//# sourceURL=${extension.runtime.getURL('main.b1ce4942.chunk.js')}\n`
// const inpageBundle = inpageContent + inpageSuffix

function injectScript (content) {
    try {
      console.log("Inject");
      const container = document.head || document.documentElement
      const scriptTag = document.createElement('script')
      scriptTag.setAttribute('async', 'false')
      scriptTag.textContent = content
      container.insertBefore(scriptTag, container.children[0])
      container.removeChild(scriptTag)
    } catch (e) {
      console.error('Injection failed.', e)
    }
  }
  
  (async () => {
    const src = chrome.runtime.getURL('./static/js/main.b1ce4942.chunk.js');
    const contentMain = await import(src);
    console.log("here");
    injectScript(contentMain);
  })();
  
  //injectScript(chrome.runtime.getUrl(path.join(__dirname, 'build', 'static', 'js', 'main.b1ce4942.chunk.js')));