function loadScripts() {
  let sources = [
    'res/jquery.min','res/jquery-ui.min','res/Chart.bundle.min',
    'env','model','parser','functions',
    'widget','chart','table','button','slider',
    'mod/base'];
    //'mod/boundedOscillators'];
  let loaded = [];
  sources.forEach(src => {
    loaded.push(new Promise(function(resolve, reject) {
      script = document.createElement('script');
      script.src = './' + src + '.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load error for ${script}`));
      document.head.append(script);
    })
  )});
  return loaded;
}
