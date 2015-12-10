# FontBrite
A Javascript HTML5 canvas bitmap font renderer, with color-changing abilities. Additional examples coming soon.

# Examples
Example font definition
```javascript
 var fontMetrics = {
    'img': 'images/font3.png', // Can be either pre-loaded DOMElement or img src
    'space': 5, // Width of spaces
    'tab': 15, // Width of tabs
	
	// Character definition
	'character': [top-left x, top-left y, width, height, line height (optional)],
	
	// Example with numbers
    '0': [0,1,8,11],
    '1': [10,1,5,11],
    '2': [20,1,8,11],
    '3': [30,1,8,11],
    '4': [40,1,8,11],
    '5': [50,1,8,11],
    '6': [60,1,8,11],
    '7': [70,1,8,11],
    '8': [80,1,8,11],
    '9': [90,1,8,11]
};
```

# API

<a name="FontBrite"></a>
## FontBrite
**Kind**: global class  
**Access:** public  

* [FontBrite](#FontBrite)
    * [new FontBrite(ctx)](#new_FontBrite_new)
    * _instance_
        * [.getFont(name)](#FontBrite+getFont) ⇒ <code>object</code>
        * [.defineFont(metrics, name)](#FontBrite+defineFont) ⇒ <code>string</code>
        * [.getStringHeight(font, string)](#FontBrite+getStringHeight) ⇒ <code>number</code>
        * [.getStringWidth(font, string)](#FontBrite+getStringWidth) ⇒ <code>number</code>
        * [.renderLine(font, string, x, y)](#FontBrite+renderLine) ⇒ <code>number</code>
        * [.renderBlock(font, string, [x], [y], [w], [h], [lh])](#FontBrite+renderBlock) ⇒ <code>number</code>
        * [.colorizeFont([name], font, h, [s], [l])](#FontBrite+colorizeFont) ⇒ <code>string</code>
    * _static_
        * [.hslToRgb(h, s, l)](#FontBrite.hslToRgb) ⇒ <code>Object</code>
        * [.rgbToHsl(r, g, b)](#FontBrite.rgbToHsl) ⇒ <code>Object</code>

<a name="new_FontBrite_new"></a>
### new FontBrite(ctx)
FontBrite - The awesome color-changing bitmap font rendererer


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>object</code> | A canvas context that will be used for output |

<a name="FontBrite+getFont"></a>
### fontBrite.getFont(name) ⇒ <code>object</code>
Retrieves font metrics for a defined font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>object</code> - The font metrics object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the font to load |

<a name="FontBrite+defineFont"></a>
### fontBrite.defineFont(metrics, name) ⇒ <code>string</code>
Defines (stores) font metrics with a name

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>string</code> - The name of the defined font  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| metrics | <code>object</code> | The metrics object, with dimensions of each character, and source image |
| name | <code>string</code> | The name of the font to define |

<a name="FontBrite+getStringHeight"></a>
### fontBrite.getStringHeight(font, string) ⇒ <code>number</code>
Gets the height of the string for the given font (single lines only)

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The height  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to get the height of |

<a name="FontBrite+getStringWidth"></a>
### fontBrite.getStringWidth(font, string) ⇒ <code>number</code>
Gets the width of the string for the given font (single lines only)

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The width  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to get the width of |

<a name="FontBrite+renderLine"></a>
### fontBrite.renderLine(font, string, x, y) ⇒ <code>number</code>
Renders a single line of text in the given font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The bottom y-coordinate of the rendered line  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to render |
| x | <code>number</code> | The x-coordinate of the top-left of the output |
| y | <code>number</code> | The y-coordinate of the top-left of the output |

<a name="FontBrite+renderBlock"></a>
### fontBrite.renderBlock(font, string, [x], [y], [w], [h], [lh]) ⇒ <code>number</code>
Renders a block (paragraph) of text in the given font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The bottom y-coordinate of the rendered line (may be different from y + h, due to font/line height)  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| font | <code>string</code> |  | The name of a defined font to use |
| string | <code>string</code> |  | The string to render |
| [x] | <code>number</code> | <code>0</code> | The x-coordinate of the top-left of the block |
| [y] | <code>number</code> | <code>0</code> | The y-coordinate of the top-left of the block |
| [w] | <code>number</code> | <code>Remaining space in canvas</code> | The desired width of the block. Long lines will be wrapped on whitespace |
| [h] | <code>number</code> | <code>Remaining space in canvas</code> | The desired height of the block. Long blocks will be truncated |
| [lh] | <code>number</code> | <code>Height of each rendered line</code> | The desired line height of each line in the block |

<a name="FontBrite+colorizeFont"></a>
### fontBrite.colorizeFont([name], font, h, [s], [l]) ⇒ <code>string</code>
Colorizes a font, replacing hot pink in any shade (r === b), with a desired color

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>string</code> - The name of the defined font  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;font__h_s_l&quot;</code> | The stored name of the resulting font |
| font | <code>string</code> |  | The name of a defined font to use |
| h | <code>number</code> |  | The hue to colorzie the font to |
| [s] | <code>number</code> | <code>100</code> | The saturation to use when colorizing the font |
| [l] | <code>number</code> | <code>Source pixel luminosity</code> | The luminosity to use when colorizing the font |

<a name="FontBrite.hslToRgb"></a>
### FontBrite.hslToRgb(h, s, l) ⇒ <code>Object</code>
Converts an HSL color to RGB

**Kind**: static method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>Object</code> - The output containing the RGB values for that color  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>number</code> | The input hue (0-360) |
| s | <code>number</code> | The input saturation (0-100) |
| l | <code>number</code> | The input luminosity (0-100) |

<a name="FontBrite.rgbToHsl"></a>
### FontBrite.rgbToHsl(r, g, b) ⇒ <code>Object</code>
Converts an RGB color to HSL

**Kind**: static method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>Object</code> - The output containing the HSL values for that color  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>number</code> | The input red component |
| g | <code>number</code> | The input green component |
| b | <code>number</code> | The input blue component |

<a name="FontBrite"></a>
## FontBrite : <code>object</code>
**Kind**: global namespace  

* [FontBrite](#FontBrite) : <code>object</code>
    * [new FontBrite(ctx)](#new_FontBrite_new)
    * _instance_
        * [.getFont(name)](#FontBrite+getFont) ⇒ <code>object</code>
        * [.defineFont(metrics, name)](#FontBrite+defineFont) ⇒ <code>string</code>
        * [.getStringHeight(font, string)](#FontBrite+getStringHeight) ⇒ <code>number</code>
        * [.getStringWidth(font, string)](#FontBrite+getStringWidth) ⇒ <code>number</code>
        * [.renderLine(font, string, x, y)](#FontBrite+renderLine) ⇒ <code>number</code>
        * [.renderBlock(font, string, [x], [y], [w], [h], [lh])](#FontBrite+renderBlock) ⇒ <code>number</code>
        * [.colorizeFont([name], font, h, [s], [l])](#FontBrite+colorizeFont) ⇒ <code>string</code>
    * _static_
        * [.hslToRgb(h, s, l)](#FontBrite.hslToRgb) ⇒ <code>Object</code>
        * [.rgbToHsl(r, g, b)](#FontBrite.rgbToHsl) ⇒ <code>Object</code>

<a name="new_FontBrite_new"></a>
### new FontBrite(ctx)
FontBrite - The awesome color-changing bitmap font rendererer


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>object</code> | A canvas context that will be used for output |

<a name="FontBrite+getFont"></a>
### fontBrite.getFont(name) ⇒ <code>object</code>
Retrieves font metrics for a defined font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>object</code> - The font metrics object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the font to load |

<a name="FontBrite+defineFont"></a>
### fontBrite.defineFont(metrics, name) ⇒ <code>string</code>
Defines (stores) font metrics with a name

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>string</code> - The name of the defined font  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| metrics | <code>object</code> | The metrics object, with dimensions of each character, and source image |
| name | <code>string</code> | The name of the font to define |

<a name="FontBrite+getStringHeight"></a>
### fontBrite.getStringHeight(font, string) ⇒ <code>number</code>
Gets the height of the string for the given font (single lines only)

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The height  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to get the height of |

<a name="FontBrite+getStringWidth"></a>
### fontBrite.getStringWidth(font, string) ⇒ <code>number</code>
Gets the width of the string for the given font (single lines only)

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The width  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to get the width of |

<a name="FontBrite+renderLine"></a>
### fontBrite.renderLine(font, string, x, y) ⇒ <code>number</code>
Renders a single line of text in the given font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The bottom y-coordinate of the rendered line  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| font | <code>string</code> | The name of a defined font to use |
| string | <code>string</code> | The string to render |
| x | <code>number</code> | The x-coordinate of the top-left of the output |
| y | <code>number</code> | The y-coordinate of the top-left of the output |

<a name="FontBrite+renderBlock"></a>
### fontBrite.renderBlock(font, string, [x], [y], [w], [h], [lh]) ⇒ <code>number</code>
Renders a block (paragraph) of text in the given font

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>number</code> - The bottom y-coordinate of the rendered line (may be different from y + h, due to font/line height)  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| font | <code>string</code> |  | The name of a defined font to use |
| string | <code>string</code> |  | The string to render |
| [x] | <code>number</code> | <code>0</code> | The x-coordinate of the top-left of the block |
| [y] | <code>number</code> | <code>0</code> | The y-coordinate of the top-left of the block |
| [w] | <code>number</code> | <code>Remaining space in canvas</code> | The desired width of the block. Long lines will be wrapped on whitespace |
| [h] | <code>number</code> | <code>Remaining space in canvas</code> | The desired height of the block. Long blocks will be truncated |
| [lh] | <code>number</code> | <code>Height of each rendered line</code> | The desired line height of each line in the block |

<a name="FontBrite+colorizeFont"></a>
### fontBrite.colorizeFont([name], font, h, [s], [l]) ⇒ <code>string</code>
Colorizes a font, replacing hot pink in any shade (r === b), with a desired color

**Kind**: instance method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>string</code> - The name of the defined font  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;font__h_s_l&quot;</code> | The stored name of the resulting font |
| font | <code>string</code> |  | The name of a defined font to use |
| h | <code>number</code> |  | The hue to colorzie the font to |
| [s] | <code>number</code> | <code>100</code> | The saturation to use when colorizing the font |
| [l] | <code>number</code> | <code>Source pixel luminosity</code> | The luminosity to use when colorizing the font |

<a name="FontBrite.hslToRgb"></a>
### FontBrite.hslToRgb(h, s, l) ⇒ <code>Object</code>
Converts an HSL color to RGB

**Kind**: static method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>Object</code> - The output containing the RGB values for that color  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>number</code> | The input hue (0-360) |
| s | <code>number</code> | The input saturation (0-100) |
| l | <code>number</code> | The input luminosity (0-100) |

<a name="FontBrite.rgbToHsl"></a>
### FontBrite.rgbToHsl(r, g, b) ⇒ <code>Object</code>
Converts an RGB color to HSL

**Kind**: static method of <code>[FontBrite](#FontBrite)</code>  
**Returns**: <code>Object</code> - The output containing the HSL values for that color  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>number</code> | The input red component |
| g | <code>number</code> | The input green component |
| b | <code>number</code> | The input blue component |

