// Get the active document
var doc = app.activeDocument;
// var pathItems = doc.pathItems;
var selectedItems = app.activeDocument.selection;
if (selectedItems.length == 0) {
	alert('Please select at least one object.');
}

// Get all the colors in the document
var colors = [];
if (selectedItems.length > 0) {
	for (var g = 0; g < selectedItems.length; g++) {
		if (selectedItems[g].fillColor) {
			if (colors.length > 0) {
				if (doc.documentColorSpace == DocumentColorSpace.CMYK) {
					if (!checkIfColorExists(selectedItems[g].fillColor, false)) {
						colors.push(selectedItems[g].fillColor);
					}
				} else if (doc.documentColorSpace == DocumentColorSpace.RGB) {
					if (!checkIfColorExists(selectedItems[g].fillColor, true)) {
						colors.push(selectedItems[g].fillColor);
					}
				}
			} else {
				colors.push(selectedItems[g].fillColor);
			}
		}
	}
	if (colors.length == 0) {
		alert('No objects selected with a fill color.');
	}
}

// Get the first artboard
var artboard = doc.artboards[0];
// Set the initial position for the squares
var xPos = 0;
// Set the yPos to above the left top corner of the first artboard
var yPos = -artboard.artboardRect[1] + 600;

// Set the gap between each square
var gap = 30;

// Loop through each color and create a square
for (var i = 0; i < colors.length; i++) {
	// Get the current color
	var color = colors[i];

	// Check the color mode of the document
	if (doc.documentColorSpace == DocumentColorSpace.CMYK) {
		var cyan = color.cyan;
		var magenta = color.magenta;
		var yellow = color.yellow;
		var black = color.black;
		var rgb = cmyk2rgb(cyan, magenta, yellow, black, false);
		var red = rgb[0];
		var green = rgb[1];
		var blue = rgb[2];
		var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
	} else if (doc.documentColorSpace == DocumentColorSpace.RGB) {
		var red = color.red;
		var green = color.green;
		var blue = color.blue;
		var cmyk = rgb2cmyk(red, green, blue, false);
		var cyan = cmyk[0];
		var magenta = cmyk[1];
		var yellow = cmyk[2];
		var black = cmyk[3];
		var hex = rgbToHex(red, green, blue);
	} else {
		alert('Document color mode is not supported to create color swatches. Must be RGB or CMYK.');
	}

	// Create a new rectangle
	var rect = doc.pathItems.rectangle(yPos, xPos, 135, 135);

	// Set the fill color to the current color
	rect.fillColor = color;
	rect.stroked = false;

	// Create a new text frame for the color values
	var textFrame = doc.textFrames.add();
	textFrame.contents =
		'CMYK: (' +
		cyan.toFixed() +
		'%, ' +
		magenta.toFixed() +
		'%, ' +
		yellow.toFixed() +
		'%, ' +
		black.toFixed() +
		'%)' +
		'\nRGB: (' +
		red +
		', ' +
		green +
		', ' +
		blue +
		')' +
		'\nHEX: ' +
		hex.toUpperCase();

	// // Position the text frame below the rectangle
	textFrame.top = rect.top - rect.height - 10;
	textFrame.left = rect.left;

	// Update the position for the next square
	xPos += rect.width + gap;
}

function rgb2cmyk(r, g, b, normalized) {
	var c = 1 - r / 255;
	var m = 1 - g / 255;
	var y = 1 - b / 255;
	var k = Math.min(c, Math.min(m, y));

	c = (c - k) / (1 - k);
	m = (m - k) / (1 - k);
	y = (y - k) / (1 - k);

	if (!normalized) {
		c = Math.round(c * 10000) / 100;
		m = Math.round(m * 10000) / 100;
		y = Math.round(y * 10000) / 100;
		k = Math.round(k * 10000) / 100;
	}

	c = isNaN(c) ? 0 : c;
	m = isNaN(m) ? 0 : m;
	y = isNaN(y) ? 0 : y;
	k = isNaN(k) ? 0 : k;

	return [c, m, y, k];
}

function cmyk2rgb(c, m, y, k, normalized) {
	c = c / 100;
	m = m / 100;
	y = y / 100;
	k = k / 100;

	c = c * (1 - k) + k;
	m = m * (1 - k) + k;
	y = y * (1 - k) + k;

	var r = 1 - c;
	var g = 1 - m;
	var b = 1 - y;

	if (!normalized) {
		r = Math.round(255 * r);
		g = Math.round(255 * g);
		b = Math.round(255 * b);
	}

	return [r, g, b];
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function checkIfColorExists(color, isRGB) {
	if (isRGB) {
		for (var i = 0; i < colors.length; i++) {
			if (colors[i].red == color.red && colors[i].green == color.green && colors[i].blue == color.blue) {
				return true;
			}
		}
	} else {
		for (var i = 0; i < colors.length; i++) {
			if (colors[i].cyan == color.cyan && colors[i].magenta == color.magenta && colors[i].yellow == color.yellow && colors[i].black == color.black) {
				return true;
			}
		}
	}
	return false;
}
