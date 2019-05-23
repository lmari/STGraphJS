function loadScripts() {
  let sources = [
    'res/jquery.min','res/jquery-ui.min','res/Chart.bundle.min',
    'env','model','parser','functions',
    'widget','chart','table','button','slider',
    'mod/rossler'];
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

function logErr(source, text, err) {
  console.error('\n*** ERROR');
  console.error(source.length > 0 ? ('*** Source: ' + source) : '');
  console.error(text.length > 0 ? ('*** ' + text) : '');
  throw err;
}

function getFun(lambda) {
  let l = lambda.toString();
  let x = l.search('=>');
  if(x == 1) throw "getFun(): ERROR: the function must be written as a lambda.";
  return [l.slice(0,x).trim(), l.slice(x+2).trim()];
}