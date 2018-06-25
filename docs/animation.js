if (makiwara === undefined){
	var makiwara = {};
}
if (makiwara.rerbstyle === undefined) {
	makiwara.rerbstyle = {};
}


makiwara.rerbstyle.animation = {

	/* ==========================
	
			Data model
	
	 ============================*/
	
	player : null,
	urls : [],
	ctx: null,
	playing: false,
	current_node_index: undefined,
	current_node: undefined,
	route: ["Aéroport Charles de Gaulle 2 TGV", "Aéroport Charles de Gaulle 1", "Parc des expositions", "Villepinte", "Sevran Beaudottes", "Aulnay sous bois", "Le blanc Mesnil", "Drancy", "Le Bourget", "La Courneuve Aubervilliers", "La Plaine Stade de France", "Gare du Nord", "Chatelet-Les halles", "St Michel Notre Dame", "Luxembourg", "Port Royal", "Denfert-Rochereau", "Cité Universitaire", "Gentilly", "Laplace", "Arcueil-Cachan", "Bagneux", "Bourg-la-Reine"],
	
	/* ==========================
	
			initialization
	
	 ============================*/
	
	
	init : function () {
		this.player = document.getElementById("player");
		this.ctx = document.getElementById("line").getContext("2d");
	},
	
	
	run : function (args) {
		console.log("Looping thread");
		if (args !== undefined && this.current_node === undefined){
			this.current_node = args.current_node;
			this.current_node_index = this.find_station_index(this.current_node.id);
			console.log("Run started with arguments : " + args.current_node.id + "index : " + this.current_node_index);
			this.current_node = args.current_node;
		}
		
		/* change the color of the starting position */
		makiwara.rerbstyle.drawing.light_node(this.current_node.shape);
		/* play sound until next station */
		var time = new Date().getTime();
		while(new Date().getTime() - time < 1000)
		{
			console.log("waiting");
		}
		
		/* change back color of the former stations */
		//makiwara.rerbstyle.drawing.dark_node(this.current_node.shape);
		
		/* move to next station */
		// console.log("Next stations " + this.next_stations_index() +" " + makiwara.rerbstyle.drawing.retrieve_stations(this.route[this.next_stations_index()]);
		// this.playing = false;
		this.current_node_index = this.next_stations_index();
		this.current_node = makiwara.rerbstyle.drawing.retrieve_stations(this.route[this.current_node_index]);
		console.log("Next stations " + this.current_node_index +" " + makiwara.rerbstyle.drawing.retrieve_stations(this.route[this.current_node_index]));
		
	},
	
	/* managing the animation */
	
	next_stations_index : function () {
		if (this.current_node_index < 0) {
			return -1;
		}
		else if (this.current_node_index == this.route.length - 1){
			return 0
		}
		else {
			return this.current_node_index + 1;
		}
			
	},
	
	find_station_index : function (station) {
		if (this.current_node_index === undefined){
			this.current_node_index = 0;
		}
		var i, l;
		l = this.route.length;
		for (i = this.current_node_index; i < l ; i++){
			
			if (this.route[i] == station){

				return i;
			}
		}		
		return -1;
		
	}


}

makiwara.rerbstyle.animation.init();
console.log("Init done for player");