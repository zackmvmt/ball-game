var game = {

	fps: 30,
	walls: [],
	balls: [],

	init: function() {
		// create canvas and context
		this.canvas = document.getElementById('world');
		this.c = this.canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		// create the world object
		this.worldAABB = new b2AABB();
		this.worldAABB.minVertex.Set(-1000, -1000);
		this.worldAABB.maxVertex.Set(1000, 1000);
		// this.gravity = new b2Vec2(0, 300);
		this.gravity = new b2Vec2(0, 0);
		this.doSleep = true;
		this.world = new b2World(this.worldAABB, this.gravity, this.doSleep);
		// create all the walls
		this.createWall(-10, 0, 10, this.height);
		this.createWall(this.width + 10, 0, 10, this.height);
		this.createWall(0, -10, this.width, 10);
		this.createWall(0, this.height + 10, this.width, 10);
		// create all the balls
		// this.createBall(100, 100, 10);
		// this.createBall(400, 110, -10);
		for (var i = 0; i < 21; i++) {
			var randx = Math.round(Math.random() * 550) + 25;
			var randy = Math.round(Math.random() * 350) + 25;
			var randvx = Math.round(Math.random() * 8) + 2;
			var randvy = Math.round(Math.random() * 8) + 2;
			this.createBall(randx, randy, randvx, randvy);
		}
		// start the step
		this.loop = setInterval(this.loop, 1000 / this.fps);
	},

	createWall: function(x, y, width, height) {
		var groundSd = new b2BoxDef();  
		groundSd.extents.Set(width, height);  
		groundSd.restitution = 0.0;  
		var groundBd = new b2BodyDef();  
		groundBd.AddShape(groundSd);  
		groundBd.position.Set(x, y);  
		this.walls.push(this.world.CreateBody(groundBd));
	},

	createBall: function(x, y, vx, vy) {
		var circleSd = new b2CircleDef();
		circleSd.density = 1.0;
		circleSd.radius = 25;
		circleSd.restitution = 1;
		circleSd.friction = 0;
		var circleBd = new b2BodyDef();
		circleBd.AddShape(circleSd);
		circleBd.position.Set(x, y);
		var ball = this.world.CreateBody(circleBd);
		var vx = (vx) ? vx * 50000 : 0;
		var vy = (vy) ? vy * 50000 : 0;
		ball.ApplyImpulse({ x: vx, y: vy }, { x: x, y: y });
		this.balls.push(ball);
	},

	loop: function() {
		game.world.Step(1.0 / game.fps, 1);
		game.drawWorld();
	},

	drawWorld: function() {
		// clear out the display
		this.c.clearRect(0, 0, this.width, this.height);
		// draw all the walls
		for (var i = 0; i < this.walls.length; i++) {
			this.drawWall(this.walls[i]);
		}
		// draw all the balls
		for (var i = 0; i < this.balls.length; i++) {
			this.drawBall(this.balls[i]);
		}
	},

	drawWall: function(wall) {
		var x = wall.m_position.x;
		var y = wall.m_position.y;
		var width = wall.m_shapeList.m_vertices[0].x;
		var height = wall.m_shapeList.m_vertices[0].y;
		this.c.fillStyle = '#333333';
		this.c.rect(x, y, width, height);
		this.c.fill();
	},

	drawBall: function(ball) {
		this.c.fillStyle = '#333333';
		this.c.beginPath();
		this.c.arc(ball.m_position.x, ball.m_position.y, 25,0, Math.PI*2, true);
		this.c.closePath();
		this.c.fill();
	}

}

game.init();
