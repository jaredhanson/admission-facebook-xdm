define(['exports', 'base64'],
function(exports, base64) {
  
  function parse(req) {
    var payload = req.split('.', 2)[1]
                     .replace(/\-/g, '+').replace(/\_/g, '/');
    var decoded = base64.decode(payload);
    
    try {
      return JSON.parse(decoded);
    } catch (_) {
      return {};
    }
  }
  
  exports.parse = parse;
  
});
