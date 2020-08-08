// Collection of userscripts to be used for scriptlet injection on domains.

/// remove-shadowroot-elem.js
/// alias rsre.js
// example.com##+js(rsre, [selector])
(() => {
		'use strict';
		const selector = '{{1}}';
		if ( selector === '' || selector === '{{1}}' ) { return; }
		let asyncTimer;
		const queryShadowRootElement = (shadowRootElement, rootElement) => {
	      		if (!rootElement) {
        		     return queryShadowRootElement(shadowRootElement, document.documentElement);
           		}
   			const els = rootElement.querySelectorAll(shadowRootElement);
    			for (const el of els) { if (el) {return el;} }
    			const probes = rootElement.querySelectorAll('*');
    			for (const probe of probes) {
        		     if (probe.shadowRoot) {
            			 const shadowElement = queryShadowRootElement(shadowRootElement, probe.shadowRoot);
            			 if (shadowElement) { return shadowElement; }
        		     }
    			}
    			return null;
		};
		const rmshadowelem = () => {
					   	asyncTimer = undefined;
						try {
						  	const elem = queryShadowRootElement(selector);
						  	if (elem) { elem.remove(); }
					   	} catch { }
		};
		const rmshadowelemAsync = () => {
						   if ( asyncTimer !== undefined ) { return; }
						   asyncTimer = window.requestAnimationFrame(rmshadowelem);
		};	
		const observer = new MutationObserver(rmshadowelemAsync);
    		observer.observe(document.documentElement, { childList: true, subtree: true });
		if ( document.readyState === "complete" ) { observer.disconnect(); }
})();

/// rem-attr.js
/// alias rma.js
// example.com##+js(rma, allow, iframe)
(() => {
		    'use strict';
		    const needle = '{{1}}';
		    if ( needle === '' || needle === '{{1}}' ) { return; }
		    const needles = needle.split(/\s*\|\s*/);
		    let selector = '{{2}}';
		    if ( selector === '' || selector === '{{2}}' ) { selector = `[${needles.join('],[')}]`; }
		    let asyncTimer;
		    const removeattr = () => {
							asyncTimer = undefined;
							const nodes = document.querySelectorAll(selector);
							try {
								for ( const node of nodes ) {
									if ( node.hasAttribute(...needles) ) {
									     node.removeAttribute(...needles);
									}	   
								}
							} catch { }
		    };
		    const removeattrAsync = () => {	if ( asyncTimer !== undefined ) { return; }
						   	asyncTimer = window.requestAnimationFrame(removeattr);
		    };				   
		    const observer = new MutationObserver(removeattrAsync);
    		    observer.observe(document.documentElement, { childList: true, subtree: true });
		    if ( document.readyState === "complete" ) { observer.disconnect(); }
})();

/// remove-node.js
/// alias rn.js
// example.com##+js(rn, /adblock|adsense/, script)
(() => { 
          'use strict';
          let needle = '{{1}}';
          if ( needle === '' || needle === '{{1}}' ) {
              needle = '.?';
          } else if ( needle.slice(0,1) === '/' && needle.slice(-1) === '/' ) {
              needle = needle.slice(1,-1);
          } else {
              needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          }
          needle = new RegExp(needle);
	  let asyncTimer, observer;
	  const remnode = () => {
		  			asyncTimer = undefined;
		  			const nodes = document.querySelectorAll('{{2}}');
		  			try {
                                                  for (const node of nodes) {
							if (needle.test(node.outerHTML)) {
                                                            node.textContent = ''; 
						       	    node.remove(); 
                                                       }     
                                                  }
                                        } catch { }
          };
	  const remnodeAsync = () => {
		  			if ( asyncTimer !== undefined ) { return; }
		                        asyncTimer =  window.requestAnimationFrame(remnode);
	  };	  
	  if ( document.readyState !== 'complete' ) {
		  	observer = new MutationObserver(remnode);  
	  	        observer.observe(document.documentElement, { childList: true, subtree: true });
	  } else {		  
			observer.disconnect();
		  	observer = new MutationObserver(remnodeAsync);  
	  	        observer.observe(document.documentElement, { childList: true, subtree: true });
	  }	  
})();

/// set-attr.js
/// alias sa.js
// example.com##+js(sa, preload, none, video)
(() => {
		  'use strict';
		  const token = '{{1}}';
		  if ( token === '' || token === '{{1}}' ) { return; }
		  const tokens = token.split(/\s*\|\s*/);
		  let selector = '{{3}}';
		  if ( selector === '' || selector === '{{3}}' ) { selector = `[${tokens.join('],[')}]`; }
		  const setattr = ev => {
			  			if (ev) { window.removeEventListener(ev.type, setattr, true); }
						try {
							const nodes = document.querySelectorAll(selector);
							for (const node of nodes) {
							     for ( const attr of tokens ) {
								   node.setAttribute(attr, '{{2}}');
							     }	   
							}
						} catch { }
		  };
		  if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
		      	   setattr();
		  } else {
			   window.addEventListener('load', setattr, true);
		  }	  
})();

/// remove-prop.js
/// alias rp.js
// example.com##+js(rp, foo.bar)
(() => {
	      'use strict';
  	      const remove = ev => {
	      				    if (ev) { window.removeEventListener(ev.type, remove, true); }
					    try {
						    delete {{1}};
					    } catch { }
              };
              if (document.readyState === 'loading') {
                       window.addEventListener('DOMContentLoaded', remove, true); 
              } else {
                       remove();  
              }
})();

/// add-elem.js
/// alias ae.js
// example.com##+js(ae, [selector], display:block !important, div)
(() => {
		'use strict';
		const identifier = '{{1}}';
		if ( identifier === '' || identifier === '{{1}}' ) { return; }
		const identifiers = identifier.split(/\s*\|\s*/);
		let executeOnce = false;
		const addelem = () => {
						if (executeOnce !== false) { return; }
						try {
							const element = document.createElement('{{3}}');
							for (const identifieradder of identifiers) {
								if (identifieradder.charAt(0) === '#') {
									 element.id = identifieradder.substring(1);
								} else if (identifieradder.charAt(0) === '.') {
									 element.className = identifieradder.substring(1);
								} else { return; }	 
							}
							element.style.cssText = '{{2}}';
							document.body.append(element);
							executeOnce = true;
						} catch { }
	   	};
	   	const observer = new MutationObserver(addelem);
    		observer.observe(document.documentElement, { childList: true, subtree: true });
})();

/// rem-class.js
/// alias rmc.js
// example.com##+js(rmc, example, [selector])
(() => {
		    'use strict';
		    const needle = '{{1}}';
		    if ( needle === '' || needle === '{{1}}' ) { return; }
		    const needles = needle.split(/\s*\|\s*/);
		    let selector = '{{2}}';
		    if ( selector === '' || selector === '{{2}}' ) { selector = '.' + needles.map(a => CSS.escape(a)).join(',.'); }
	            let asyncTimer;
		    const removeclass = () => {
							asyncTimer = undefined;
			    				const nodes = document.querySelectorAll(selector);
							try {
								for ( const node of nodes ) {
								      if ( node.classList.contains(...needles) ) {
		 							   node.classList.remove(...needles);
								      }
	    							}
							} catch { }
		    };
		    const removeclassAsync = () => {
			    				if ( asyncTimer !== undefined ) { return; }
			    				asyncTimer = window.requestAnimationFrame(removeclass);
		    };    
		    const observer = new MutationObserver(removeclassAsync);
    		    observer.observe(document.documentElement, { childList: true, subtree: true });
		    if ( document.readyState === "complete" ) { observer.disconnect(); }
})();

/// add-class.js
/// alias ac.js
// example.com##+js(ac, example, [selector])
(() => {
		    'use strict';
		    const needle = '{{1}}';
		    if ( needle === '' || needle === '{{1}}' ) { return; }
		    const needles = needle.split(/\s*\|\s*/);
		    let selector = '{{2}}';
		    if ( selector === '' || selector === '{{2}}' ) { selector = '.' + needles.map(a => CSS.escape(a)).join(',.'); }
		    const addclass = ev => {
						if (ev) { window.removeEventListener(ev.type, addclass, true);  }
						const nodes = document.querySelectorAll(selector);
						try {
							for ( const node of nodes ) {
							      node.classList.add(...needles);
							}
						} catch { }
		    };
		    if (document.readyState === 'loading') {
		    	      window.addEventListener('DOMContentLoaded', addclass, true);
	   	    } else {
		    	      addclass();
	   	    }
})();

/// replace-class.js
/// alias rec.js
// example.com##+js(rec, example, example2, [selector])
(() => {
		    'use strict';
		    const needle = '{{1}}';
		    if ( needle === '' || needle === '{{1}}' ) { return; }
		    const needles = needle.split(/\s*\|\s*/);
		    let selector = '{{3}}';
		    if ( selector === '' || selector === '{{3}}' ) { selector = '.' + needles.map(a => CSS.escape(a)).join(',.'); }
		    const replaceclass = ev => {
							if (ev) { window.removeEventListener(ev.type, replaceclass, true);  }
							const nodes = document.querySelectorAll(selector);
							try {
								for ( const node of nodes ) {
								      for (const tokens of needles ) {
									    if ( node.classList.contains(tokens) ) {
									         node.classList.replace(tokens, '{{2}}');
									    }
								      }		    
								}
							} catch { }
		    };
		    if (document.readyState === 'loading') {
		    	      window.addEventListener('DOMContentLoaded', replaceclass, true);
	   	    } else {
		    	      replaceclass();
	   	    }
})();

/// set-innerHTML.js
/// alias sih.js
// example.com##+js(sih, [selector], <span class="btext">Download</span>)
(() => {
		'use strict';
		const selector = '{{1}}';
		if ( selector === '' || selector === '{{1}}' ) { return; }
		const sih = ev => {
					   if (ev) { window.removeEventListener(ev.type, sih, true); }
					   try {
						  const elements = document.querySelectorAll(selector);
						  for (const element of elements) {
							element.innerHTML = '{{2}}';
						  }
					   } catch { }
		};
		if (document.readyState === 'loading') {
		    	    window.addEventListener('DOMContentLoaded', sih, true);
	   	} else {
		    	    sih();
	   	} 
})();

/// node-logger.js
/// alias nl.js
// example.com##+js(nl, script)
(() => {
		'use strict';
		const needle = '{{1}}';
		if ( needle === '' || needle === '{{1}}' ) { return; }
		const lognodes = ev => {
					  if (ev) { window.removeEventListener(ev.type, lognodes, true); }
					  try {
						const nodes = document.querySelectorAll(needle);
						const log = console.log.bind(console);
						for (const node of nodes) {
						     log('uBO: %s("%s")', needle, node.outerHTML);
						}
					  } catch { }
		};
		if (document.readyState === 'complete') {
			 lognodes(); 
		} else {
			 window.addEventListener('load', lognodes, true);
		}
})();

/// multiup.js
/// alias mtu.js
// example.com##+js(mtu, form[action], button[link], action, link)
(() => {
		'use strict';
		const selector = '{{1}}';
		if ( selector === '' || selector === '{{1}}' ) { return; }
		const selector2 = '{{2}}';
		if ( selector2 === '' || selector2 === '{{2}}' ) { return; }
		const multiup = ev => {
						if (ev) { window.removeEventListener(ev.type, multiup, true); }
						try {
							const elem = document.querySelectorAll(selector);
							const elem2 = document.querySelectorAll(selector2);
							for (let i = 0; i < elem.length; i++) {
								elem[i].setAttribute('{{3}}', elem2[i].getAttribute('{{4}}'));
							}
						} catch { }
		};
		if (document.readyState === 'loading') {
		    	    window.addEventListener('DOMContentLoaded', multiup, true);
	   	} else {
		    	    multiup();
	   	}
})();

/// insert-iframe.js
/// alias ii.js
// example.com##+js(ii, 2, [selector], src, style)
(() => {
    	        'use strict';
		const iframes = '{{1}}';
		if ( iframes === '' || iframes === '{{1}}' ) { return; }
		let executeOnce = false;
		const insertframe = () => {
						  if (executeOnce !== false) { return; }
						  try {
							for ( let i = 0; i < iframes; i++ ) {
							      const iframe = document.createElement('iframe');
							      iframe.setAttribute('id', '{{2}}');
							      iframe.setAttribute('src', '{{3}}');
							      iframe.setAttribute('style', '{{4}}');
							      document.body.append(iframe);
							}
							executeOnce = true;
						  } catch { }
		};			
		const observer = new MutationObserver(insertframe);
    		observer.observe(document.documentElement, { childList: true, subtree: true });
})();

/// insert-elem-before.js
/// alias ieb.js
// example.com##+js(ieb, [selector], display:block !important, node, div)
(() => {
		'use strict';
		const identifier = '{{1}}';
		if ( identifier === '' || identifier === '{{1}}' ) { return; }
		const identifiers = identifier.split(/\s*\|\s*/);
		let executeOnce = false;
		const insertelem = () => {
						if (executeOnce !== false) { return; }
						try {
							const element = document.createElement('{{4}}');
							const node = document.querySelector('{{3}}');
							for (const identifieradder of identifiers) {
								if (identifieradder.charAt(0) === '#') {
									 element.id = identifieradder.substring(1);
								} else if (identifieradder.charAt(0) === '.') {
									 element.className = identifieradder.substring(1);
								} else { return; }	 
							}
							element.style.cssText = '{{2}}';
							document.body.insertBefore(element, node);
							executeOnce = true;
						} catch { }
	   	};
	   	const observer = new MutationObserver(insertelem);
    		observer.observe(document.documentElement, { childList: true, subtree: true });
})();

/// append-elem.js
/// alias ape.js
// example.com##+js(ape, [selector], element, attribute, value)
(() => {
		'use strict';
		const selector = '{{1}}';
		if ( selector === '' || selector === '{{1}}' ) { return; }
		const appendNode = ev => {
						if (ev) { window.removeEventListener(ev.type, appendNode, true); }
						try {
							const elements = document.querySelectorAll(selector);
							for ( const element of elements ) {
							      const node = document.createElement('{{2}}');
							      node.setAttribute('{{3}}', '{{4}}');
							      element.append(node);
							}
						} catch { }
		};
		if (document.readyState === 'complete') {
		    	    appendNode();
	   	} else {
		    	    window.addEventListener('load', appendNode, true);
	   	}
})();

/// removeItem.js
/// alias ri.js
// example.com##+js(ri, key)
(() => {
		'use strict';
		const key = '{{1}}';
		if ( key === '' || key === '{{1}}' ) { return; }
		const keys = key.split(/\s*\|\s*/);
		let asyncTimer;
		const removeItem = () => {
		 			   	   asyncTimer = undefined;
						   try {
							   for (const keyName of keys) {
								if (!localStorage.getItem(keyName)) { break; }
								localStorage.removeItem(keyName);
							   }
						   } catch { }
		};
		const removeItemAsync = () => {
						   if ( asyncTimer !== undefined ) { return; }
						   asyncTimer = window.requestAnimationFrame(removeItem);
		};	
		const observer = new MutationObserver(removeItemAsync);
    		observer.observe(document.documentElement, { childList: true, subtree: true });
		if ( document.readyState === "complete" ) { observer.disconnect(); }
})();

/// setItem.js
/// alias si.js
// example.com##+js(si, key, value)
(() => {
		'use strict';
		const key = '{{1}}';
		if ( key === '' || key === '{{1}}' ) { return; }
		const value = '{{2}}';
		if ( value === '' || value === '{{2}}' ) { return; }
		const setItem = ev => {
		 			   if (ev) { window.removeEventListener(ev.type, setItem, true); }
					   try {
						   localStorage.setItem(key, value);
					   } catch { }
		};
		if (document.readyState === 'loading') {
		    	    window.addEventListener('DOMContentLoaded', setItem, true); 
	   	} else {
		    	    setItem();
	   	}
})();

/// executesitefunction.js
/// alias esf.js
// example.com##+js(esf, funcName, funcDelay)
(() => {
	      'use strict';
	      const funcCall = '{{1}}';
	      if ( funcCall === '' || funcCall === '{{1}}' ) { return; }
	      const funcDelay = '{{2}}';
	      if ( funcDelay === '' || funcDelay === '{{2}}' ) { return; }
	      const funcInvoke = ev => { 
		      				if (ev) { window.removeEventListener(ev.type, funcInvoke, true); }
		      				try { 
							setTimeout(window[funcCall], funcDelay);
						} catch { }
	      };	      
	      if (document.readyState === 'interactive' || document.readyState === 'complete') {
		    	    funcInvoke();
	      } else {
		    	    window.addEventListener('DOMContentLoaded', funcInvoke, true);
	      }
})();

/// no-alert-if.js
/// alias naif.js
// example.com##+js(naif, /loading ad/)
(() => {
                'use strict';
		let needle = '{{1}}';
                if ( needle === '' || needle === '{{1}}' ) {
                     needle = '.?';
                } else if ( needle.slice(0,1) === '/' && needle.slice(-1) === '/' ) {
                     needle = needle.slice(1,-1);
                } else {
                     needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                needle = new RegExp(needle);
                window.alert = new Proxy(window.alert, {
                       apply: (target, thisArg, args) => {
                        	const a = args[0];
                        	if ( needle.test(String(a)) === false ) {
                            	     return target.apply(thisArg, args);
                        	}
                       }
                });
})();