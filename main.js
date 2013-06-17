define(['./lib/dom',
        'fbxdm',
        'querystring',
        'events',
        'class'],
function(dom, xdm, qs, Emitter, clazz) {
  
  var IFRAME_TITLE = 'Facebook XDM Frame';
  
  /**
   * `Provider` constructor.
   *
   * Examples:
   *
   *     admission.use(new FacebookProvider({
   *         appID: '123456789'
   *       }));
   *
   * @param {Object} opts
   * @api public
   */
  function Provider(opts) {
    opts = opts || {};
    Emitter.call(this);
    this.name = 'facebook';
    this._pingURL = opts.pingURL || 'https://www.facebook.com/connect/ping';
    this._proxyPath = opts.proxyPath || '/connect/xd_arbiter.php?version=25';
    this._clientID = opts.clientID || opts.appID;
    this._responseType = opts.responseType || 'token,signed_request,code';
  }
  
  /**
   * Inherit from `Emitter`.
   */
  clazz.inherits(Provider, Emitter);
  
  Provider.prototype.login = function() {
    var self = this;
    
    var u = self._getAuthUrl(true);
    
    dom.createIframe({
      root: document.body,
      //root: container,
      name: 'fb-immediate',
      url: u,
      style: { display: 'none' }
    });
    
    return this;
  }
  
  /**
   * Start the identity provider.
   *
   * @return {Provider}
   * @api public
   */
  Provider.prototype.start = function() {
    console.log('FacebookXDMProvider.start');
    
    var channel = 'foo'; // TODO: generate unique channel name
    var origin = window.location.protocol + '//' + window.location.host;
    var proxySecret = 's3cr3t'; // TODO: generate random secret
    var channelPath = '/channel.html' + '?' + 'fb_xd_fragment#xd_sig=' + proxySecret + '&';
    
    
    var self = this;
    var container = dom.appendHidden(document.createElement('div'));
    
    var transport = xdm.create({
      root: container,
      channel: channel
    }, function() {
      var frag = {
        channel: channel, 
        origin: window.location.protocol + '//' + window.location.host,
        channel_path: channelPath, 
        transport: transport
      }
      
      
      var proxyUrl = self._proxyPath + '#' + qs.stringify(frag)
      
      // TODO: Resolve cdn if option is set.
      //var httpDomain = 'http://www.facebook.com';
      //var httpsDomain = 'https://www.facebook.com';
      var httpDomain = 'http://static.ak.facebook.com';
      var httpsDomain = 'https://s-static.ak.facebook.com';
      
      // TODO: Conditionally load this iframe.
      dom.createIframe({
        url: httpDomain + proxyUrl,
        name: 'fb_xdm_frame_http',
        id: 'fb_xdm_frame_http',
        root: container,
        'aria-hidden':true,
        title: IFRAME_TITLE,
        'tab-index': -1
      });
      
      dom.createIframe({
        url: httpsDomain + proxyUrl,
        name: 'fb_xdm_frame_https',
        id: 'fb_xdm_frame_https',
        root: container,
        'aria-hidden':true,
        title: IFRAME_TITLE,
        'tab-index': -1
      });
      
      
      // TODO: Make the initial immediate mode check optional.
      var authUrl = self._getAuthUrl(true);
      
      dom.createIframe({
        root: container,
        name: 'fb-immediate',
        url: authUrl,
        style: { display: 'none' }
      });
    });
    
    xdm.action('proxy_ready', function() {
      console.log('PROXY READY!!!!');
    });
    
    return this;
  }
  
  Provider.prototype._getAuthUrl = function(immediate) {
    // TODO: Build the redirect URI correctly
    
    var httpDomain = 'http://static.ak.facebook.com';
    // TODO: Save this as an ivar
    var channel = 'foo'; // TODO: generate unique channel name
    
    var frag = {
      cb: '123456', // TODO: generate a unique callback ID
      origin: window.location.protocol + '//' + window.location.host + '/' + channel,
      domain: location.hostname, 
      relation: 'parent'
    }
    
    var proxyUrl = this._proxyPath + '#' + qs.stringify(frag)
    
    var query = {
      client_id: this._clientID,
      response_type: this._responseType,
      domain: location.hostname,
      origin: 1, // ???
      redirect_uri: httpDomain + proxyUrl,
      sdk: 'joey'
    }
    
    return this._pingURL + '?' + qs.stringify(query);
  }
  
  return Provider;
});
