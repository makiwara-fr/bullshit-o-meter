
if (makiwara === undefined){
	var makiwara = {};
}
if (makiwara.bullshitometer === undefined) {
	makiwara.bullshitometer = {};
}

class Thread {

	constructor (runnable){
		this.runnable = runnable;
		this.running = false;
		this.tobestopped = false;
		this.args = {};
	}
	
	/* start a thread looping a specific speed in milliseconds for a potential max_duration */
	start (loop_duration, max_duration) {
		//setup value or get default
		if (loop_duration !== undefined) {
			this.loop_duration = loop_duration;
		}
		if (max_duration !== undefined) {
			this.max_duration = max_duration
		}
		else if (this.max_duration === undefined){
				this.max_duration = 10000;
		}
		
			
		this.running = true;
		if (this.start_time === undefined) {
			this.start_time = new Date().getTime();
		}
	
		if (new Date().getTime() - this.start_time < this.max_duration && this.tobestopped != true) {
			//we are not looping for too long and not needing to stop
			
			this.runnable.run(this.args);
			var t = this;
			var fun = function (){
				t.start();
			}
			setTimeout(fun, this.loop_duration);
		}
		else {
				// stop order received or timeout so we reset data
				this.running = false;
				this.tobestopped = false;
				this.start_time = undefined;
				console.log("thread ended");
		}
	}
	
	/* Stop the running thread */
	stop () {
		if (this.running){
			this.tobestopped = true;
			console.log("stop order received");
		}
	}
}

makiwara.bullshitometer.drawing = {
	
	
	/* ==========================
	
			Data model
	
	 ============================*/




	/* general settings */
	canvas_size : {x: 1200, y: 500},
	grad_thickness : 1,
	grad_sector_thickness : 10,
	line_thickness : 3,
	color_meter : "#8d8d8e",
	color_line : "#000000",
	
	color_warning: "#f27f1a",
	color_danger: "#FF1300",
	color_ok : "#68ba51",
	
	grad : {x: 0, y: 0, radius: 0, alpha : Math.PI /16, omega : Math.PI * 15/16, grad_length: 0.1},
	
	
	
	canvas: null,
	ctx: null,
	
	line: null,

	

	/* ==========================
	
			Drawing the meter
	
	 ============================*/
	
	
	
	/* define size of canvas and set general parameters dynamically */
	set_canvas: function () {

		this.canvas = document.getElementById("meter");
		
		
		/* set canvas size*/
		if (window.innerWidth < 360) {
			this.canvas.width = 340;
		} 
		else if (window.innerWidth < 600){
			this.canvas.width = window.innerWidth * 0.9;
		}
		else {
			this.canvas.width = 600;
		}
		this.canvas.height = this.canvas.width * 0.75;
		
		
		/* store the info for graduations  */
		
		this.grad.x = this.canvas.width / 2;
		this.grad.y = this.canvas.height * 0.75;
		this.grad.radius = this.canvas.width / 2 * 0.75;
		
		
		
		/* define context */
		this.ctx = this.canvas.getContext("2d");
	},
		



	
	
	draw_meter: function () {
		
		
		if (this.ctx) {
			
			console.log("Drawing the graduation");
			
			//length of the arc 
			var span = 2*Math.PI - this.grad.omega + this.grad.alpha;
			
			//draw the arc of graduations
			//===========================
			
			var grads = new Path2D();
			grads.lineWidth = this.grad_thickness;
			grads.arc(this.grad.x, this.grad.y, this.grad.radius , this.grad.alpha, this.grad.omega, true)
			
			
			this.ctx.lineWidth = 2 * this.grad_thickness;
			this.ctx.strokeStyle = this.color_meter;
			
			this.ctx.lineJoin = "miter";
			// draw the path
			this.ctx.stroke(grads);
			
			
			// draw the arc of color
 			//=====================
			
			var sector_path;
			var sector_limits = [{color: this.color_ok, start: 0.8, end: 1}, {color: this.color_ok, start: 0.74, end: 0.795}, {color: this.color_ok, start: 0.7, end: 0.735}, {color: this.color_ok, start: 0.67, end: 0.695}, {color: this.color_danger, start: 0, end: 0.1},  {color: this.color_warning, start: 0.105, end: 0.2}, {color: this.color_warning, start: 0.205, end: 0.260}, {color: this.color_warning, start: 0.265, end: 0.29},{color: this.color_warning, start: 0.295, end: 0.31}];

			function rgbToRgba(rgb, alpha) {
			  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
			}
			
			for (let sector of sector_limits) {
   				sector_path = new Path2D();
   				sector_path.arc(this.grad.x, this.grad.y, this.grad.radius * 1.15, this.grad.alpha - sector.start * span, this.grad.alpha - sector.end * span, true);
   				this.ctx.lineWidth = 5 * this.grad_sector_thickness;
   				// this.ctx.strokeStyle = sector.color;
				thix.ctx.strokeStyle = rgbToRgba(sector.color, 0.6)
   				this.ctx.stroke(sector_path);
			};
			
			
			
			
			
			
			//draw the measuring lines and figures
			//====================================
			var line, txt ;
			
			var angle = 0
			var length = this.grad.grad_length;
			
			for (var i=0; i<11; i++) {
				
				line = new Path2D();
				angle = -(1-i/10)* span + this.grad.alpha;
				if (i % 2 == 0) {
					length = 0.8;
					//draw the figure above the graduations
					this.ctx.font = "16pt 'Open Sans'";
					this.ctx.textAlign = "center";
					this.ctx.textBaseline = 'middle';
					this.ctx.lineWidth = this.grad_thickness;
					this.ctx.fillText(""+ i*10 + "%", this.grad.x + this.grad.radius * 0.7 * Math.cos(angle), this.grad.y + this.grad.radius * 0.7 * Math.sin(angle));
				}
				else
				{
					length = 0.9;
				}

				line.moveTo(this.grad.x + this.grad.radius * (length) * Math.cos(angle), this.grad.y + this.grad.radius * (length) * Math.sin(angle));
				line.lineTo(this.grad.x + this.grad.radius * Math.cos(angle), this.grad.y + this.grad.radius * Math.sin(angle));
		
				this.ctx.lineWidth = this.grad_thickness;
				this.ctx.strokeStyle = this.color_line;
				this.ctx.lineJoin = "miter";
		
				//draw the line
				this.ctx.stroke(line);
				
				
				
				
				
				
			
			}
			
			
		}
	},
	
	
	
	
	
	/* ==========================
	
			drawing line
	
	 ============================*/
	draw_line: function (percentage) {
		//remove last line
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		
		//draw the rest of the meter
		this.draw_meter();
		
		//define the new line
		this.line = new Path2D();
		var span = 2*Math.PI - this.grad.omega + this.grad.alpha;
		var angle = -span * (1-percentage) + this.grad.alpha;
		
		
		this.line.moveTo(this.grad.x, this.grad.y);
		this.line.lineTo(this.grad.x + this.grad.radius * 1.15 * Math.cos(angle), this.grad.y + this.grad.radius * 1.15 * Math.sin(angle));
		
		this.ctx.lineWidth = 2 * this.line_thickness;
		this.ctx.strokeStyle = this.color_line;
		this.ctx.lineJoin = "miter";
		
		//draw the line
		this.ctx.stroke(this.line);
		
		
		
	}
	
}



