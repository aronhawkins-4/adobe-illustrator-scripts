function main() {
	// Get the active document
	var doc = app.activeDocument;

	if (doc.selection.length < 2) {
		alert('Please select at one logo object and at least one fill color object.');
		return;
	}

	// Get the selected object
	var selectedObject = doc.selection[0];

	if (selectedObject.typename != 'CompoundPathItem') {
		alert('First selected object must be a compound path. Tip: Place colors at the bottom of the layers panel.');
		return;
	}

	// Get all objects with a fill color
	var objectsWithFill = [];
	for (var i = 1; i < doc.selection.length; i++) {
		var item = doc.selection[i];
		if (item.fillColor) {
			objectsWithFill.push(item);
		}
	}
	var xLoc = selectedObject.position[0];
	var yLoc = selectedObject.position[1] - selectedObject.height - 10;

	// Generate variants
	if (selectedObject.typename == 'CompoundPathItem') {
		for (var i = 0; i < objectsWithFill.length; i++) {
			var variant = selectedObject.duplicate();
			variant.pathItems[0].filled = true;
			variant.pathItems[0].fillColor = objectsWithFill[i].fillColor;
			variant.position = [xLoc, yLoc];
			yLoc -= selectedObject.height + 10;
		}
	}
}

main();
