Pirate.js is a simple tool (for the moment) that will (hopefully) allow the use of HTML5 elements/attributes.

> **WARNING**:  There are **no plans** to support IE6 in this.  Any support for IE6 is entirely coincidental, and will be altered in favor of IE7+ and other browsers, if it will increase performance or decrease footprint.

The progress can be found on this readme.

`input type="password"` and `input type="text"`
The `placeholder` attribute works in IE7+, should work in everything.  No additional JS is needed to make it work, but there is one major issue:  It sets the value of the element, which is not the best idea.  For `password` inputs, it creates a temporary element which can be accessed via JavaScript, meaning that if you're looping through elements, this one will exist.  More on this to come.