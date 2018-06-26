
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
	
		//init the slider position based on url parameters
		var value = location.search.split('value=')[1]
		console.log(value);
		if (value !== undefined && value <= 100 && value >= 0) {
			this.slider.value = Number(value);
		} else {
			this.slider.value = 50;
		}
	
		//init the measure to slider position
		makiwara.bullshitometer.drawing.draw_line(slider.value / 100);
	}
	
	
}


makiwara.bullshitometer.init = function () {
	console.log("Bullshit-o-meter initialization");
	console.log("===============================");
	/*set canvas general format*/
	makiwara.bullshitometer.drawing.set_canvas();
	
	/* init the slider behaviour */
	makiwara.bullshitometer.sliding.init();
}


makiwara.bullshitometer.init();
