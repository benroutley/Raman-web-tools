/// <reference lib="webworker" />

import * as PolyFit from './polyfit';

addEventListener('message', ({ data }) => {

  postMessage('done');
});
