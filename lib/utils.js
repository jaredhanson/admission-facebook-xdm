define(['exports', './utils'],
function(exports, utils) {
  
  function copyProperties(obj, a, b, c, d, e, f) {
    obj = obj || {};

    var args = [a, b, c, d, e];
    var ii = 0, v;
    while (args[ii]) {
      v = args[ii++];
      for (var k in v) {
        obj[k] = v[k];
      }
      
      if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
          (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
        obj.toString = v.toString;
      }
    }

    return obj;
  }
  
  exports.copyProperties = copyProperties;
  
});
