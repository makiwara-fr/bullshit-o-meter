
if (makiwara === undefined){
	var makiwara = {};
}
if (makiwara.bullshitometer === undefined) {
	makiwara.bullshitometer = {};
}



makiwara.bullshitometer.sliding = {
	
	init : function () {
		this.drawing = makiwara.bullshitometer.drawing;
		
		/* ==========
		   The slider
		   ========== */
		this.slider = document.getElementById("slider");
		// add a listener to the slider
		this.slider.addEventListener('mouseup', function (){
			console.log("Move to " + slider.value);
			makiwara.bullshitometer.drawing.draw_line(slider.value / 100);
		});
	
		
	}
	
	
}


makiwara.bullshitometer.init = function () {
	console.log("Bullshit-o-meter initialization");
	console.log("===============================");
	/*set canvas general format*/
	makiwara.bullshitometer.drawing.set_canvas();
	/* Draw the graduatuion */
	makiwara.bullshitometer.drawing.draw_meter();
	/* draw first measure */
	makiwara.bullshitometer.drawing.draw_line(0);
	makiwara.bullshitometer.drawing.draw_line(0.3);
	makiwara.bullshitometer.drawing.draw_line(1);
	
	/* init the slider behaviour */
	makiwara.bullshitometer.sliding.init();
}


makiwara.bullshitometer.init();
