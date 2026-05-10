/* global hexo */

'use strict';

hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/css/custom.css">',
  'default'
);

hexo.extend.injector.register(
  'body_end',
  '<script src="/js/mermaid-viewer.js"></script>',
  'default'
);
