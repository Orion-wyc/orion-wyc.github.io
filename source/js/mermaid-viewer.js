/* Mermaid 图表查看器：支持放大、缩小、复制源码、拖动 */
(function() {
  'use strict';

  var MermaidViewer = {
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
    scaleStep: 0.2,
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    currentContainer: null,
    sourceCodes: new Map(),

    init: function() {
      var self = this;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          self.setupMermaidContainers();
        });
      } else {
        self.setupMermaidContainers();
      }
    },

    setupMermaidContainers: function() {
      var self = this;
      var mermaidCodes = document.querySelectorAll('.markdown-body pre code.mermaid');
      
      mermaidCodes.forEach(function(code, index) {
        var pre = code.closest('pre');
        if (!pre || pre.dataset.mermaidViewer) return;
        pre.dataset.mermaidViewer = 'true';
        
        var sourceCode = code.textContent || '';
        self.sourceCodes.set(pre, sourceCode);
        
        var wrapper = document.createElement('div');
        wrapper.className = 'mermaid-viewer-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        var toolbar = self.createToolbar(pre, index);
        wrapper.insertBefore(toolbar, pre);
        
        self.setupDragAndZoom(pre, wrapper);
      });
    },

    createToolbar: function(pre, index) {
      var self = this;
      var toolbar = document.createElement('div');
      toolbar.className = 'mermaid-toolbar';
      
      var zoomIn = self.createButton('放大', '+', 'zoom-in');
      
      var zoomOut = self.createButton('缩小', '-', 'zoom-out');
      
      var reset = self.createButton('重置缩放', 'RESET', 'reset');
      
      var copy = self.createButton('复制源码', 'COPY', 'copy');

      var scaleDisplay = self.createScaleDisplay();
      
      toolbar.appendChild(zoomOut);
      toolbar.appendChild(zoomIn);
      toolbar.appendChild(reset);
      toolbar.appendChild(copy);
      toolbar.appendChild(scaleDisplay);

      self.bindToolbarActions(toolbar, pre);
      
      return toolbar;
    },

    createButton: function(title, label, action) {
      var btn = document.createElement('button');
      btn.className = 'mermaid-toolbar-btn';
      btn.type = 'button';
      btn.title = title;
      btn.setAttribute('aria-label', title);
      btn.dataset.action = action;
      btn.textContent = label;
      return btn;
    },

    bindToolbarActions: function(toolbar, pre) {
      var self = this;
      if (!toolbar) {
        return;
      }

      toolbar.querySelectorAll('.mermaid-toolbar-btn').forEach(function(btn) {
        var action = btn.dataset.action;
        if (action === 'zoom-in') {
          btn.onclick = function() {
            self.zoom(pre, self.scaleStep);
          };
        } else if (action === 'zoom-out') {
          btn.onclick = function() {
            self.zoom(pre, -self.scaleStep);
          };
        } else if (action === 'reset') {
          btn.onclick = function() {
            self.resetZoom(pre);
          };
        } else if (action === 'copy') {
          btn.onclick = function() {
            self.copySource(pre);
          };
        }
      });
    },

    createScaleDisplay: function() {
      var scaleDisplay = document.createElement('span');
      scaleDisplay.className = 'mermaid-scale-display';
      scaleDisplay.textContent = '100%';
      return scaleDisplay;
    },

    getScaleDisplay: function(pre) {
      var wrapper = pre.closest('.mermaid-viewer-wrapper');
      if (!wrapper) {
        return null;
      }
      return wrapper.querySelector('.mermaid-scale-display');
    },

    updateScaleDisplay: function(pre, scale) {
      var scaleDisplay = this.getScaleDisplay(pre);
      if (scaleDisplay) {
        scaleDisplay.textContent = Math.round(scale * 100) + '%';
      }
    },

    zoom: function(pre, delta) {
      var self = this;
      var svg = pre.querySelector('.mermaid > svg');
      if (!svg) return;
      
      var currentScale = parseFloat(svg.dataset.scale) || 1;
      var newScale = Math.max(self.minScale, Math.min(self.maxScale, currentScale + delta));
      
      svg.dataset.scale = newScale;
      svg.style.transform = 'scale(' + newScale + ')';
      svg.style.transformOrigin = 'center center';
      
      self.updateScaleDisplay(pre, newScale);
    },

    resetZoom: function(pre) {
      var svg = pre.querySelector('.mermaid > svg');
      if (!svg) return;
      
      svg.dataset.scale = 1;
      svg.style.transform = 'scale(1)';
      
      pre.scrollLeft = 0;
      pre.scrollTop = 0;
      
      this.updateScaleDisplay(pre, 1);
    },

    fitToContainer: function(pre) {
      var svg = pre.querySelector('.mermaid > svg');
      if (!svg) return;
      
      var svgRect = svg.getBoundingClientRect();
      var preRect = pre.getBoundingClientRect();
      
      var scaleX = (preRect.width - 40) / svgRect.width;
      var scaleY = (preRect.height - 40) / svgRect.height;
      var scale = Math.min(scaleX, scaleY, 1);
      
      svg.dataset.scale = scale;
      svg.style.transform = 'scale(' + scale + ')';
      svg.style.transformOrigin = 'center center';
      
      this.updateScaleDisplay(pre, scale);
    },

    copySource: function(pre) {
      var sourceCode = this.sourceCodes.get(pre) || '';
      var self = this;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sourceCode).then(function() {
          self.showCopySuccess(pre);
        }).catch(function() {
          self.fallbackCopy(sourceCode, pre);
        });
      } else {
        self.fallbackCopy(sourceCode, pre);
      }
    },

    fallbackCopy: function(text, pre) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showCopySuccess(pre);
      } catch (err) {
        console.error('复制失败:', err);
      }
      document.body.removeChild(textarea);
    },

    showCopySuccess: function(pre) {
      var wrapper = pre.closest('.mermaid-viewer-wrapper');
      if (!wrapper) return;
      
      var existing = wrapper.querySelector('.mermaid-copy-toast');
      if (existing) existing.remove();
      
      var toast = document.createElement('div');
      toast.className = 'mermaid-copy-toast';
      toast.textContent = '已复制到剪贴板';
      wrapper.appendChild(toast);
      
      setTimeout(function() {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
          toast.remove();
        }, 300);
      }, 2000);
    },

    setupDragAndZoom: function(pre, wrapper) {
      var self = this;
      
      pre.addEventListener('mousedown', function(e) {
        if (e.target.closest('.mermaid-toolbar')) return;
        
        self.isDragging = true;
        self.currentContainer = pre;
        pre.classList.add('mermaid-dragging');
        self.startX = e.pageX - pre.offsetLeft;
        self.startY = e.pageY - pre.offsetTop;
        self.scrollLeft = pre.scrollLeft;
        self.scrollTop = pre.scrollTop;
        e.preventDefault();
      });
      
      document.addEventListener('mousemove', function(e) {
        if (!self.isDragging || self.currentContainer !== pre) return;
        
        var x = e.pageX - pre.offsetLeft;
        var y = e.pageY - pre.offsetTop;
        var walkX = x - self.startX;
        var walkY = y - self.startY;
        
        pre.scrollLeft = self.scrollLeft - walkX;
        pre.scrollTop = self.scrollTop - walkY;
      });
      
      document.addEventListener('mouseup', function() {
        if (self.currentContainer === pre) {
          self.isDragging = false;
          self.currentContainer = null;
          pre.classList.remove('mermaid-dragging');
        }
      });
      
      pre.addEventListener('wheel', function(e) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          var delta = e.deltaY > 0 ? -self.scaleStep : self.scaleStep;
          self.zoom(pre, delta);
        }
      }, { passive: false });
    }
  };

  if (typeof Fluid !== 'undefined' && Fluid.events) {
    Fluid.events.registerRefreshCallback(function() {
      MermaidViewer.setupMermaidContainers();
    });
  }

  MermaidViewer.init();
  
  window.MermaidViewer = MermaidViewer;
})();
