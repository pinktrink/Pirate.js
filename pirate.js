/*
Issues:
-input text and password placeholders:
	What if the element's value needs to be accessed externally?  The current method is going to cause issues in that case.  Traversing upwards for a form isn't a good idea either.  Remember that it's not only form submits that the value will be read.

There is no intent to support IE6 with this, only IE7+.

Optimizations:
-Performance:
	In .html5.loader, the regex in the replace method shouldn't be instantiated OTF (on the fly), it should be compiled before it is called.  I just need to figure out where I'm going to put it.

-Ease of use:
	Any instance of the classes "pir-placeholder", "pir-placeholder-hidden", and "pir-placeholder-shown" should be put in the config (wherever I decide to put that) so that they can be configured by the developer.

*/

(function(){
	var Pirate = {  //Arrrrrrrrr
		functions : {  //Alright, so I think it's the best idea here to NOT have to rely on a framework, so let's add in some custom cross-browser solutions here.
					   //These should look familiar, I built them for Skeleton originally.
			getElementsByClassName : function(context, cls){  //This will mimic element.getElementsByClassName functionality for older browsers that do not support it, such as IE7.
				if(context.getElementsByClassName){
					return context.getElementsByClassName(cls);
				}
				
				var ele = context.getElementsByTagName("*"),
					ret = [],
					current,
					classes;
				
				for(var i = 0, j = ele.length; i < j; i++){
					current = ele[i];
					classes = (current.getAttribute("className") || current.className).split(" ");
					for(var k = 0, l = classes.length; k < l; k++){
						if(classes[k] === cls){
							ret.push(current);
							break;
						}
					}
				}
				
				return ret;
			},
			
			filterTag : function(list, tag){  //This will filter elements in a given NodeList based on either a tag string or an array of tags.
				if(tag.push){
					var exists = false;
					for(var i = 0, j = tag.length; i < j; i++){
						for(var k = 0, l = list.length; k < l; k++){
							if(list[k].tagName === tag[i]){
								exists = true;
								break;
							}
						}
						if(exists === true){
							list.splice(k, 1);
						}
					}
				}else{
					for(var k = 0, l = list.length; k < l; k++){
						if(list[k].tagName === tag){
							list.splice(k, 1);
							break;
						}
					}
				}
				
				return list;
			},
			
			addClass : function(element, name){  //This will add the class(es) given in name to element, if they are not already present
				var classes = (element.getAttribute("className") || element.className).split(" "),
					exists = false;
				
				if(name.push){
					for(var i = 0, j = name.length; i < j; i++){
						for(var k = 0, l = classes.length; k < l; k++){
							if(classes[k] === name[i]){
								exists = true;
								break;
							}
						}
						if(!exists){
							classes.push(name[i]);
							element.className = classes.join(" ");
						}
					}
				}else{
					for(var k = 0, l = classes.length; k < l; k++){
						if(classes[k] === name){
							exists = true;
							break;
						}
					}
					if(!exists){
						classes.push(name);
						element.className = classes.join(" ");
					}
				}
			},
			
			removeClass : function(element, name){  //This will remove the class(es) given in name from the current element, if present
				var classes = (element.getAttribute("className") || element.className).split(" "),
					exists = false;
				if(name.push){
					for(var i = 0, j = name.length; i < j; i++){
						for(var k = 0, l = classes.length; k < l; k++){
							if(classes[k] === name[i]){
								exists = true;
								break;
							}
						}
						if(exists){
							classes.splice(k, 1);
							element.className = classes.join(" ");
						}
					}
				}else{
					for(var k = 0, l = classes.length; k < l; k++){
						if(classes[k] === name){
							exists = true;
							break;
						}
					}
					if(exists){
						classes.splice(k, 1);
						element.className = classes.join(" ");
					}
				}
			},
			
			swapClass : function(element, from, to){  //Quick alias for element.removeClass(), element.addClass();
				this.removeClass(element, from);
				this.addClass(element, to);
			},
			
			addListener : function(element, on, fn, last){  //Attaches an event listener to an element, compatible with IE7+8's faulty event handler system (when an event is attached with attachEvent, it is not called in the proper context, thus 'this' is actually 'window')
				last = (last || false);
				var BH;
				
				if(window.addEventListener){  //AddEventListener takes precedence here.
					BH = "addEventListener";
				}else if(window.attachEvent){
					BH = "attachEvent";
					on = "on" + on;
				}
				
				element[BH](on, function(e){
					var event = e || window.event;
					return fn.call(element, event);  //Force it to call the handler in the proper context (IE 7 & 8 do not).
				}, last);
			},
			
			ascendFor : {
				tagName : function(element, tag){
					while(element.parentNode && element.parentNode.tagName !== tag){
						element = element.parentNode;
					}  //This could all be done in a for loop, but that's not as readable.  Sure it looks cooler, but nobody cares how cool your code looks, they care that it works properly, unless it's JAPH code.  Then it can look pretty.
					return (element.parentNode || false);
				}
			}
		},
		
		html5 : {
			form : {
				support : {
					placeholder : 'placeholder' in document.createElement('input')
				},
				managedElements : {  //Necessary so that redundant processing doesn't happen.
					color : [],
					email : [],
					url : [],
					number : [],
					range : [],
					date : [],
					month : [],
					week : [],
					time : [],
					datetime : [],
					search : [],
					datetime_local : [],
					text : [],
					password : []
				},
				inputElements : [],
				
				create : {
					color : function(){
						
					},
					
					email : function(){
						
					},
					
					url : function(){
						
					},
					
					number : function(){
						
					},
					
					range : function(){
						
					},
					
					date : function(){
						
					},
					
					month : function(){
						
					},
					
					week : function(){
						
					},
					
					time : function(){
						
					},
					
					datetime : function(){
						
					},
					
					search : function(){
						
					},
					
					datetime_local : function(){
						
					},
					
					text : function(element){
						if(!Pirate.html5.form.support.placeholder && element.getAttribute("placeholder") !== null){  //I don't care what anyone says, a compatibility check is GOING to happen, and this is the least redundant I can make it, as it WILL happen SOMEWHERE in the loop. Why not the most logical place?
							Pirate.html5.form.textPlaceholder(element);
						}
					},
					
					password : function(element){
						if(!Pirate.html5.form.support.placeholder && element.getAttribute("placeholder") !== null){
							Pirate.html5.form.passPlaceholder(element);
						}
					}
				},
				
				textPlaceholder : function(element){  //Sets up placeholders in text inputs, attaches the proper event handlers.
					if(element.value === ""){
						element.value = element.getAttribute("placeholder");
						Pirate.functions.addClass(element, "pir-placeholder");
					}
					element._pirate.hasChanged = false;
					
					Pirate.functions.addListener(element, "focus", function(){
						if(!this._pirate.hasChanged){
							this.value = "";
							Pirate.removeClass(this, "pir-placeholder");
						}
					});
					
					Pirate.addListener(element, "blur", function(){
						if(this.value === ""){
							this.value = this.getAttribute("placeholder");
							Pirate.addClass(this, "pir-placeholder");
							this._pirate.hasChanged = false;
						}
					});
					
					Pirate.addListener(element, "keyup", function(){
						this._pirate.hasChanged = true;
					});
					
					Pirate.html5.form.managedElements.text.push(this);
				},
				
				passPlaceholder : function(element){  //Sets up placeholders in password inputs, attaches the proper event handlers.
					var tempElement = document.createElement("input"),
						passElement = element;
					
					tempElement.value = passElement.getAttribute("placeholder");
					tempElement.setAttribute("type", "text");
					Pirate.addClass(tempElement, ["pir-placeholder", "pir-placeholder-hidden"]);
					Pirate.addClass(passElement, "pir-placeholder-shown");
					passElement.parentNode.insertBefore(tempElement, (passElement.nextSibling || passElement));
					
					if(element.value === ""){
						Pirate.swapClass(tempElement, "pir-placeholder-hidden", "pir-placeholder-shown");
						Pirate.swapClass(passElement, "pir-placeholder-shown", "pir-placeholder-hidden");
					}
					passElement._pirate.hasChanged = false;
					
					Pirate.addListener(tempElement, "focus", function(){
						if(!passElement._pirate.hasChanged){
							Pirate.swapClass(passElement, "pir-placeholder-hidden", "pir-placeholder-shown");
							Pirate.swapClass(this, "pir-placeholder-shown", "pir-placeholder-hidden");
							passElement.focus();
						}
					});
					
					Pirate.addListener(passElement, "blur", function(){
						if(this.value === ""){
							tempElement.value = passElement.getAttribute("placeholder");  //Why this is here:  What if they changed the placeholder via JavaScript between the previous time and the current time this handler was called?  We need to ensure that the placeholder value is refreshed every time it is displayed.
							Pirate.swapClass(tempElement, "pir-placeholder-hidden", "pir-placeholder-shown");
							Pirate.swapClass(this, "pir-placeholder-shown", "pir-placeholder-hidden");
							this._pirate.hasChanged = false;
						}
					});
					
					Pirate.addListener(passElement, "keyup", function(){
						this.Pirate.hasChanged = true;
					});
					
					Pirate.html5.form.managedElements.text.push(this);
				}
			},
			
			loader : function(){  //Attaches HTML5 handlers to specific elements.
				var type,
					inputs = Pirate.html5.form.inputElements = document.getElementsByTagName("input");
				
				for(var i = 0, j = inputs.length; i < j; i++){
					inputs[i]._pirate = {};  //The reason I'm doing this is to be able to hold our own data about the element.  Personally I add _ in front in case a for(... in ...) loop comes, I can perform if(.substr(0, 1) !== "_")
					if((type = (inputs[i].getAttribute("type") || "").replace(/-/g, "_")) && Pirate.html5.form.create[type]){
						Pirate.html5.form.create[type](inputs[i]);
					}
				}
			}
		}
	};
})();