
if (makiwara === undefined){
	var makiwara = {};
}
if (makiwara.rerbstyle === undefined) {
	makiwara.rerbstyle = {};
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

makiwara.rerbstyle.drawing = {
	
	
	/* ==========================
	
			Data model
	
	 ============================*/




	/* general settings */
	canvas_size : {x: 1200, y: 500},
	line_thickness : 15,
	general_size : 300,
	canvas: null,
	ctx: null,
	player: null,
	
	
	/* Drawing the line */
	line_nodes: {},
	stations_nw : ["Aéroport Charles de Gaulle 2 TGV", "Aéroport Charles de Gaulle 1", "Parc des expositions", "Villepinte", "Sevran Beaudottes"],
	stations_north_to_south_main_branch : ["Aulnay sous bois", "Le blanc Mesnil", "Drancy", "Le Bourget", "La Courneuve Aubervilliers", "La Plaine Stade de France", "Gare du Nord", "Chatelet-Les halles", "St Michel Notre Dame", "Luxembourg", "Port Royal", "Denfert-Rochereau", "Cité Universitaire", "Gentilly", "Laplace", "Arcueil-Cachan", "Bagneux", "Bourg-la-Reine"],
	color_line: "#4c90cd",
	color_selected_stations: "#FF0000",
	color_default_stations: "#FFFFFF",
	
	/* the route taken by the animation */
	route : [],
	
	
	/* all the elements */
	stations_dots: [],
	playing: false,
	

	/* ==========================
	
			Drawing the line
	
	 ============================*/
	
	
	
	/* define size of canvas and set general parameters dynamically */
	set_canvas: function () {

		this.canvas = document.getElementById("line");
		
		if (window.innerWidth - 40 > this.canvas_size.x) {
			this.canvas_size.x = window.innerWidth - 40;
			console.log("Window is " + window.innerWidth + " wide. Setting canvas to : " + this.canvas_size.x);
			
		}
		//define the canvas actual size
		this.canvas.width = this.canvas_size.x;
		this.canvas.height = this.canvas_size.y;
		//define main proportion
		this.general_size = (this.canvas_size.x - 100) / 2.3;
		
		
		/* define the position of main nodes of the line */
		this.line_nodes = {
			n_north : {x: 50 + (this.general_size * 0.4), y: 250},
			n_south : {x: 50 + (this.general_size * 1.4), y: 250},
			n_sw: {x: 50 + (this.general_size * 1.5), y: 350},
			n_se: {x: 50 + (this.general_size * 1.5), y: 150},
			n_ne: {x: 50 + (this.general_size * 0.3), y: 150},
			n_nw: {x: 50 + (this.general_size * 0.3), y: 350},
			n_fnw: {x: 50, y: 350},
			n_fne: {x: 50 + (this.general_size * 0.1), y: 150},
			n_fsw: {x: 50 + (this.general_size * 1.7), y: 350},
			n_fse: {x: (this.canvas_size.x - 50), y: 150}

		};
		
		/* define context */
		this.ctx = this.canvas.getContext("2d");
	},
		



	
	
	draw_line: function () {
		
		
		if (this.ctx) {
			
			
			var line = new Path2D();
			
			line.lineWidth = this.line_thickness;
			
			line.moveTo(this.line_nodes.n_fnw.x, this.line_nodes.n_fnw.y);
			line.lineTo(this.line_nodes.n_nw.x, this.line_nodes.n_nw.y);
			line.lineTo(this.line_nodes.n_north.x, this.line_nodes.n_north.y);
			line.lineTo(this.line_nodes.n_south.x, this.line_nodes.n_south.y);
			line.lineTo(this.line_nodes.n_sw.x, this.line_nodes.n_sw.y);
			line.lineTo(this.line_nodes.n_fsw.x, this.line_nodes.n_fsw.y);
			line.moveTo(this.line_nodes.n_south.x, this.line_nodes.n_south.y);
			line.lineTo(this.line_nodes.n_se.x, this.line_nodes.n_se.y);
			line.lineTo(this.line_nodes.n_fse.x, this.line_nodes.n_fse.y);
			line.moveTo(this.line_nodes.n_north.x, this.line_nodes.n_north.y);
			line.lineTo(this.line_nodes.n_ne.x, this.line_nodes.n_ne.y);
			line.lineTo(this.line_nodes.n_fne.x, this.line_nodes.n_fne.y);
			
			this.ctx.lineWidth = 2 * this.line_thickness;
			this.ctx.strokeStyle = this.color_line;
			this.ctx.lineCap = "round";
			this.ctx.lineJoin = "miter";
			this.ctx.stroke(line);
			
			
		}
	},
	
	
	add_stations_on_branch: function (stations_lists, point_orig, point_destination, top_or_down) {
        
        var x, y, i, l;
		l = stations_lists.length

		for (i = 0; i < l; i++){
			
			//draw a circle per station
			var circle = new Path2D();
			this.ctx.fillStyle = this.color_default_stations;
			this.ctx.rotate(0);
			x = (point_destination.x - point_orig.x ) / (stations_lists.length - 1) * i + point_orig.x;
			y = (point_destination.y - point_orig.y ) / (stations_lists.length - 1) * i + point_orig.y;
			
			circle.moveTo(x, y);
			circle.arc(x, y , this.line_thickness, 0, 2*Math.PI, true);
			this.ctx.fill(circle);
			//add to general list of dots
			this.stations_dots.push({id: stations_lists[i], shape: circle});
			
			//add the name of stations
			this.ctx.save();
			var text = new Path2D();
			
			this.ctx.fillStyle = "black";
			
			
			this.ctx.textAlign = 'right';
			if (top_or_down){
				
				// ctx.fillText(stations_lists[i], x , y + 2*this.line_thickness);
				this.ctx.translate(x,y +  2 * this.line_thickness);
				
				
			}
			else{

				// ctx.fillText(stations_lists[i], x , y - 2*this.line_thickness);
				this.ctx.translate(x,y - 2 * this.line_thickness);
			}
			this.ctx.rotate(-Math.PI / 2);
			this.ctx.fillText(stations_lists[i], 0 , 0);
			this.ctx.restore();
		}
		
	},
	
	add_stations: function(){
		this.add_stations_on_branch(this.stations_nw, this.line_nodes.n_fnw, this.line_nodes.n_nw, true);
		this.add_stations_on_branch(this.stations_north_to_south_main_branch, this.line_nodes.n_north, this.line_nodes.n_south, true);
		
		//add a listener to detect clicks on stations
		this.canvas.addEventListener('click', function (e)
        {
            var x = e.offsetX;
            var y = e.offsetY;
			var i, l;
			l = makiwara.rerbstyle.drawing.stations_dots.length
			for (i = 0; i < l; i++) {
				/* dectect if a station has been clicked on */
				if (makiwara.rerbstyle.drawing.ctx.isPointInPath(makiwara.rerbstyle.drawing.stations_dots[i].shape, x, y)) {
					console.log('Clicked! on '+ makiwara.rerbstyle.drawing.stations_dots[i].id );
					
					//track status of thread
					makiwara.rerbstyle.drawing.playing = !makiwara.rerbstyle.drawing.playing;

					if (makiwara.rerbstyle.drawing.playing == true){
						makiwara.rerbstyle.drawing.player.args.current_node = makiwara.rerbstyle.drawing.stations_dots[i];
						makiwara.rerbstyle.drawing.player.start(1000);
					}
					else {
						makiwara.rerbstyle.drawing.player.stop();
					}
						// makiwara.rerbstyle.drawing.play(makiwara.rerbstyle.drawing.stations_dots[i].shape )
					// makiwara.rerbstyle.drawing_animation.play(makiwara.rerbstyle.drawing.stations_dots[i].shape, makiwara.rerbstyle.drawing);
					
					break;
					
				}
			}
        }, false);
	},
	
	/* ==========================
	
			Changing node
	
	 ============================*/
	 
	 
	light_node : function (node){
	
		this.ctx.fillStyle = this.color_selected_stations;
		this.ctx.fill(node);
	},
	
	dark_node : function (node){
	
		this.ctx.fillStyle = this.color_default_stations;
		this.ctx.fill(node);
	},

	/* ==========================
	
			Getters & setters
	
	 ============================*/


	/* send the id and the path representing a station based on its name */
	retrieve_stations : function (station) {
		var i,l;
		l = this.stations_dots.length;
		for (i = 0; i < l ; i++){
			if (this.stations_dots[i].id == station){
				return this.stations_dots[i]
				break
			}
		}
		return null;
	}
	
}

console.log("RERB.style initialization");
console.log("=========================");
/*set canvas general format*/
makiwara.rerbstyle.drawing.set_canvas();
/* Draw the shape of the line */
makiwara.rerbstyle.drawing.draw_line();
/* add stations on the line */
makiwara.rerbstyle.drawing.add_stations();
/* check all stations displayed */
console.log(makiwara.rerbstyle.drawing.stations_dots);
/* create animation manager */
makiwara.rerbstyle.drawing.player = new Thread(makiwara.rerbstyle.animation);
//makiwara.rerbstyle.drawing.player.init();
