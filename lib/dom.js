define(['exports', './utils'],
function(exports, utils) {
  
  var hiddenRoot;
  
  function append(content, root) {
    root = root || document.body;
    
    if (typeof content == 'string') {
      var div = document.createElement('div');
      root.appendChild(div).innerHTML = content;
      return div;
    } else {
      return root.appendChild(content);
    }
  }
  
  function appendHidden(content) {
    if (!hiddenRoot) {
      var hiddenRoot = document.createElement('div')
        , style = hiddenRoot.style;
      style.position = 'absolute';
      style.top      = '-10000px';
      style.width    = style.height = 0;
      hiddenRoot = append(hiddenRoot);
    }

    return append(content, hiddenRoot);
  }
  
  function createIframe(opts) {
    opts = utils.copyProperties({}, opts);
    var frame;
    var root = opts.root;
    var name = opts.name;
    var src = opts.url;
    var style = opts.style || { border: 'none' };
    
    if (hasNamePropertyBug()) {
      frame = document.createElement('<iframe name="' + name + '"/>');
    } else {
      frame = document.createElement('iframe');
      frame.name = name;
    }
    
    // delete attributes that we're setting directly
    delete opts.style;
    delete opts.url;
    delete opts.name;
    delete opts.root;
    
    var attributes = utils.copyProperties({
      frameBorder: 0,
      allowTransparency: true,
      scrolling: 'no'
    }, opts);

    if (attributes.width) {
      frame.width = attributes.width + 'px';
    }
    if (attributes.height) {
      frame.height = attributes.height + 'px';
    }
    
    delete attributes.height;
    delete attributes.width;
    
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        frame.setAttribute(key, attributes[key]);
      }
    }

    utils.copyProperties(frame.style, style);
    
    frame.src = "javascript:false";
    root.appendChild(frame);
    frame.src = src;
    return frame;
  }
  
  
  var _hasNamePropertyBug;
  
  function hasNamePropertyBug() {
    if (typeof _hasNamePropertyBug !== 'undefined') return _hasNamePropertyBug;
    
    var form = document.createElement("form")
      , input = form.appendChild(document.createElement("input"));
    input.name = '__XyZ__'; // TODO: Set this to a randomly generated value.
    _hasNamePropertyBug = input !== form.elements[input.name];
    form = input = null;
    return _hasNamePropertyBug;
  }
  
  
  exports.append = append;
  exports.appendHidden = appendHidden;
  exports.createIframe = createIframe;
  
});
