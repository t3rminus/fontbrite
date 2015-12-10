/**
 * @name FontBrite
 * @namespace
 */
(function(){
	var Util = {
		/**
		 * Shortcut to create an image object from a src. Already-created images are simply returned
		 * @param {string} src The image src, or an existing image
		 * @returns {object} The create img DOMElement
		 * @private
		 */
		createImage: function(src) {
			if(src.src) {
				return src;
			}

			var img = document.createElement('img');
			img.src = src;
			return img;
		},

		/**
		 * UTF-8 safe string splitter
		 * Returns array of symbols in string, even if they're multi-byte
		 * @param {string} string The input string
		 * @returns {Array} The resulting array of symbols
		 * @private
		 */
		getSymbols: function(string) {
			var index = 0,
				length = string.length,
				output = [];
			for (; index < length - 1; ++index) {
				var charCode = string.charCodeAt(index);
				if (charCode >= 0xD800 && charCode <= 0xDBFF) {
					charCode = string.charCodeAt(index + 1);
					if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
						output.push(string.slice(index, index + 2));
						++index;
						continue;
					}
				}
				output.push(string.charAt(index));
			}
			output.push(string.charAt(index));
			return output;
		},

		/**
		 * Custom method for luminosity changes
		 *
		 * Uses multiply if > 0 (darken if values from 0-1, lighten with values >1)
		 * Uses divide if < 0 (darken if values <-1, lighten with values from -1-0)
		 *
		 * @param {number} current The current value (to be multiplied or divided)
		 * @param {number} change The multiplier/divisor
		 * @returns {number} The result
		 * @private
		 */
		compressLuminosity: function(current, change) {
			return change >= 0 ? current * change : current / Math.abs(change);
	    },
	    hue2rgb: function(p, q, t) {
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		},
		/**
		 * Applies color to an image, at any shade, for parts that are hot pink (r === b)
		 * @param {object} img The source DOMElement image
		 * @param {number} h The new hue (0-360)
		 * @param {number} [s=100] The saturation of the new hue (0-100)
		 * @param {number} [l=1] The luminosity value. >=0 uses multiply blend (0-1 darkens, >1 lightens) <0 uses divide blend (-1-0 lightens, <-1 darkens)
		 * @returns {object} The new DOMElement image with colors set
		 * @private
		 */
		colorizeImage: function(img, h, s, l) {
			if(!img.complete) {
				throw new Error('Colorize fail - image not yet loaded');
			}

			// Create a temp canvas, and draw the image onto it
			var tmpCanvas = document.createElement('canvas');
			tmpCanvas.width = img.width;
			tmpCanvas.height = img.height;
			var tmpCtx = tmpCanvas.getContext('2d');
			tmpCtx.drawImage(img, 0, 0);

			// Get the pixel data from the canvas
			var imageData = tmpCtx.getImageData(0,0,tmpCanvas.width,tmpCanvas.height),
				data = imageData.data;

			// Loop over pixels
			var r, g, b, newColor;
			for (var i = 0; i < data.length; i += 4) {
				r = data[i];
				g = data[i + 1];
				b = data[i + 2];

				// If they're identical, but green is different, then we want to colourize
				if(r === b && g !== r) {
					// Get the HSV representation
					newColor = FontBrite.rgbToHsl(r, g, b);
					// Set the H & S
					newColor.h = h;
					newColor.s = s;
					// Compressive luminosity
					newColor.l = Util.compressLuminosity(newColor.l, l);
					// Put it back
					newColor = FontBrite.hslToRgb(newColor.h, newColor.s, newColor.l);
					data[i] = newColor.r;
					data[i + 1] = newColor.g;
					data[i + 2] = newColor.b;
				}
			}
			tmpCtx.putImageData(imageData, 0, 0);
			return Util.createImage(tmpCanvas.toDataURL('image/png'));
		}
	};

	/**
	 * FontBrite - The awesome color-changing bitmap font rendererer
	 * @param {object} ctx A canvas context that will be used for output
	 * @constructor
	 * @public
	 * @name FontBrite
	 */
	var FontBrite = function(ctx) {
		this.ctx = ctx;
		this.fonts = {};
		this.coloredFonts = {};
	};

	/**
	 * Retrieves font metrics for a defined font
	 * @param {string} name The name of the font to load
	 * @returns {object} The font metrics object
	 * @public
	 * @name FontBrite#getFont
	 * @function
	 */
	FontBrite.prototype.getFont = function(name) {
		return this.fonts[name] || this.coloredFonts[name];
	};

	/**
	 * Defines (stores) font metrics with a name
	 * @param {object} metrics The metrics object, with dimensions of each character, and source image
	 * @param {string} name The name of the font to define
	 * @returns {string} The name of the defined font
	 * @public
	 * @name FontBrite#defineFont
	 * @function
	 */
	FontBrite.prototype.defineFont = function(metrics, name) {
		if(!metrics.img.src) {
			metrics.img = Util.createImage(metrics.img);
		}

		if(!name) {
			name = metrics.img.src;
		}

		metrics.name = name;

		if(metrics.img.complete) {
			metrics.ready = true;
		} else {
			metrics.ready = false;
			metrics.img.addEventListener('load', function() {
				metrics.ready = true;
			});
		}

		this.fonts[name] = metrics;
		return name;
	};

	/**
	 * Gets the height of the string for the given font (single lines only)
	 * @param {string} font The name of a defined font to use
	 * @param {string} string The string to get the height of
	 * @returns {number} The height
	 * @public
	 * @name FontBrite#getStringHeight
	 * @function
	 */
	FontBrite.prototype.getStringHeight = function(font, string) {
		var chars = Util.getSymbols(string),
			height = 0;

		font = this.getFont(font);

		if(!font) {
			throw new Error('That font is not defined!');
		}

		for(var i = 0; i < chars.length; i++) {
			var char = font[chars[i]] || font['\uFFFD'] || font[' '];
			if(!Array.isArray(char)) {
				continue;
			}

			height = Math.max(height, char[4] || char[3]);
		}

		return height;
	};

	/**
	 * Gets the width of the string for the given font (single lines only)
	 * @param {string} font The name of a defined font to use
	 * @param {string} string The string to get the width of
	 * @returns {number} The width
	 * @public
	 * @name FontBrite#getStringWidth
	 * @function
	 */
	FontBrite.prototype.getStringWidth = function(font, string) {
		// Get the width of all characters in the string
		var chars = Util.getSymbols(string),
			width = 0;

		font = this.getFont(font);

		if(!font) {
			throw new Error('That font is not defined!');
		}

		for(var i = 0; i < chars.length; i++) {
			// Handling for whitespace
			if(chars[i] === ' ') {
				width += font.space;
				continue;
			}
			if(chars[i] === '\t') {
				width += font.tab;
				continue;
			}

			// Standard chars
			var char = font[chars[i]] || font['\uFFFD'];
			if(!Array.isArray(char)) {
				continue;
			}

			width = width += char[2];
		}

		return width;
	};

	/**
	 * Renders a single line of text in the given font
	 * @param {string} font The name of a defined font to use
	 * @param {string} string The string to render
	 * @param {number} x The x-coordinate of the top-left of the output
	 * @param {number} y The y-coordinate of the top-left of the output
	 * @return {number} The bottom y-coordinate of the rendered line
	 * @public
	 * @name FontBrite#renderLine
	 * @function
	 */
	FontBrite.prototype.renderLine = function(font, string, x, y) {
		// Make sure the font
		font = this.getFont(font);

		if(!font) {
			throw new Error('That font is not defined!');
		}

		if(!font.ready) {
			return;
		}

		// Drawify the outputings
		var chars = Util.getSymbols(string), height = 0;
		for(var i = 0; i < chars.length; i++) {
			if(chars[i] === '') {
				continue;
			}
			// Handling for whitespace
			if(chars[i] === ' ') {
				x += font.space;
				continue;
			}
			if(chars[i] === '\t') {
				x += font.tab;
				continue;
			}

			var char = font[chars[i]] || font['\uFFFD'] || font[' '];

			this.ctx.drawImage(font.img, char[0], char[1], char[2], char[3], x, y, char[2], char[3]);
			x += char[2];
			height = Math.max(height, char[4] || char[3]);
		}

		return height;
	};

	/**
	 * Renders a block (paragraph) of text in the given font
	 * @param {string} font The name of a defined font to use
	 * @param {string} string The string to render
	 * @param {number} [x=0] The x-coordinate of the top-left of the block
	 * @param {number} [y=0] The y-coordinate of the top-left of the block
	 * @param {number} [w=Remaining space in canvas] The desired width of the block. Long lines will be wrapped on whitespace
	 * @param {number} [h=Remaining space in canvas] The desired height of the block. Long blocks will be truncated
	 * @param {number} [lh=Height of each rendered line] The desired line height of each line in the block
	 * @return {number} The bottom y-coordinate of the rendered line (may be different from y + h, due to font/line height)
	 * @public
	 * @name FontBrite#renderBlock
	 * @function
	 */
	FontBrite.prototype.renderBlock = function(font, string, x, y, w, h, lh) {
		x = x || 0;
		y = y || 0;
		w = w || this.ctx.canvas.width - x;
		h = h || this.ctx.canvas.height - y;

		// Split into "blocks" (paragraphs?)
		var blocks = string.split('\n');
		var lines = [], lineCount = 0, totalHeight = y;

		// Split each block into lines depending on the width
		for(var bi = 0; bi < blocks.length; bi++) {
			// Get each word in the block
			var words = blocks[bi].match(/(\S+|\s)/g);
			var lineWidth = 0;

			for(var wi = 0; wi < words.length; wi++) {
				// Get the width of the word
				var word = words[wi],
					wordWidth = this.getStringWidth(font, word);

				// If the current width + word width is less than the max width
				if(lineWidth + wordWidth <= w) {
					// Add to line
					if(lines[lineCount]) {
						lines[lineCount] += word;
					} else {
						lines[lineCount] = word;
					}
					lineWidth += wordWidth;
				} else {
					// Is this the start of the line?
					if(!lines[lineCount]) {
						// Yeah, we should just put it on this line
						lines[lineCount] = word;
						lineWidth = wordWidth;
					} else {
						// Otherwise move down one line
						lineCount++;
						lines[lineCount] = word;
						lineWidth = wordWidth;
					}
				}
			}
			// End of a block triggers a new line
			lineCount++;
		}

		// Write out all the lines that fit
		for(var li = 0; li < lines.length; li++) {
			var line = lines[li];
			if(!line) {
				continue;
			}

			var height = lh || this.getStringHeight(font, line);

			// Are we too high? Stop this madness!
			if(height + totalHeight > h) {
				break;
			}

			// Draw the line
			this.renderLine(font, line, x, totalHeight);
			// Move down to the next line
			totalHeight += height;
		}

		return totalHeight;
	};

	/**
	 * Converts an HSL color to RGB
	 * @param {number} h The input hue (0-360)
	 * @param {number} s The input saturation (0-100)
	 * @param {number} l The input luminosity (0-100)
	 * @returns {{r: number, g: number, b: number}} The output containing the RGB values for that color
	 * @public
	 * @name FontBrite.hslToRgb
	 * @function
	 */
	FontBrite.hslToRgb = function(h, s, l){
		var r, g, b;

		h /= 360;
		s /= 100;
		l /= 100;

		if(s === 0){
			r = g = b = l; // achromatic
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = Util.hue2rgb(p, q, h + 1/3);
			g = Util.hue2rgb(p, q, h);
			b = Util.hue2rgb(p, q, h - 1/3);
		}

		return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
	};

	/**
	 * Converts an RGB color to HSL
	 * @param {number} r The input red component
	 * @param {number} g The input green component
	 * @param {number} b The input blue component
	 * @returns {{h: number, s: number, l: number}} The output containing the HSL values for that color
	 * @public
	 * @name FontBrite.rgbToHsl
	 * @function
	 */
	FontBrite.rgbToHsl = function(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min) {
			h = s = 0; // achromatic
		}
		else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	};

	/**
	 * Colorizes a font, replacing hot pink in any shade (r === b), with a desired color
	 * @param {string} [name=font__h_s_l] The stored name of the resulting font
	 * @param {string} font The name of a defined font to use
	 * @param {number} h The hue to colorzie the font to
	 * @param {number} [s=100] The saturation to use when colorizing the font
	 * @param {number} [l=Source pixel luminosity] The luminosity to use when colorizing the font
	 * @returns {string} The name of the defined font
	 * @public
	 * @name FontBrite#colorizeFont
	 * @function
	 */
	FontBrite.prototype.colorizeFont = function(name, font, h, s, l) {
		if(typeof(font) === 'number') {
			// "Name" not specified
			l = s;
			s = h;
			h = font;
			font = name;
			name = undefined;
 		}

		s = (s === undefined) ? 100 : s;

		// Make sure the font
		font = this.getFont(font);
		if(!font) {
			throw new Error('That font is not defined!');
		}

		name = name || (font.name + '__' + h + '_' + s + '_' + l);

		// Color cache
		if(this.coloredFonts[name]) {
			return this.coloredFonts[name];
		}

		// Clone the font metrics
		var newFont = {}, symbols = Object.keys(font);
		for(var i = 0; i < symbols.length; i++) {
			newFont[symbols[i]] = font[symbols[i]];
		}
		newFont.name = name;

		// Recolor only if ready. If not set a callback
		if(font.ready) {
			newFont.img = Util.colorizeImage(font.img, h, s, l);
			newFont.ready = true;
		} else {
			font.img.addEventListener('load', function(){
				newFont.img = Util.colorizeImage(font.img, h, s, l);
				newFont.ready = true;
			});
		}

		// Store in the cache
		this.coloredFonts[name] = newFont;
		return name;
	};

	// Exporting-- Node, RequireJS, Browser use
	if(typeof define === "function" && define.amd) {
		define(function(){
			return FontBrite;
		});
	} else if(typeof module === "object" && module.exports) {
		module.exports = FontBrite;
	} else {
		window.BitmapFontRenderer = FontBrite;
	}
}());