var Tetris = {
	boardSize: 20,

	boardChar: '*',

	board: undefined,

	gameSpeed: 500,

        gameLoopId: -1,

	pieceMatrix: [
		[
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0]
		],

		[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 1, 0]
		],

		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 1, 1, 0]
		],

		[
			[0, 0, 0, 0],
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0]
		],

		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		]
	],

	getRandomPiece: function () {
		var totalKindsOfPieces = this.pieceMatrix.length-1, pieceIndex = Math.round(Math.random() * totalKindsOfPieces);
		return new Piece(this.pieceMatrix[pieceIndex]);
	},

	start: function () {
		this.board = new Board(this.boardSize, this.boardChar);
		this.addRandomPiece();
		this.addEvents();
		this._ping();
	},

	addEvents: function () {
		var self = this;
		$(window).on("keydown", function (e) {
			self.handleKeyStroke(e.which);
		});
	},

	handleKeyStroke: function (keyStroke) {
		var currentPiece = this.currentPiece;
		switch (keyStroke) {
			case 37:    //Move Left
				if(!this.board.hitTest(currentPiece, {col: currentPiece.colInBoard-1, row: currentPiece.rowInBoard+1})) {
					currentPiece.left();
					this.board.render();
				}
				break;
			case 39:    //Move Right
				if(!this.board.hitTest(currentPiece, {col: currentPiece.colInBoard+1, row: currentPiece.rowInBoard+1})) {
					currentPiece.right();
					this.board.render();
				}
				break;
			case 38:    //Rotate
				if(!this.board.hitTest(currentPiece, {col: currentPiece.colInBoard+1, row: currentPiece.rowInBoard+1})) {
					currentPiece.rotate();
					this.board.render();
				}
				break;
			case 40:    //Counter Rotate
				if(!this.board.hitTest(currentPiece, {col: currentPiece.colInBoard+1, row: currentPiece.rowInBoard+1})) {
					currentPiece.counter();
					this.board.render();
				}
				break;
		}
	},

	addRandomPiece: function () {
		this.currentPiece = this.getRandomPiece();
		this.board.addPiece(this.currentPiece);
	},

	_ping: function () {
                var self = this;
                this.gameLoopId = setTimeout(function () {
                        self.gameLoop();
                }, this.gameSpeed);
        },

	gameLoop: function () {
		if(this.board.hitTest(this.currentPiece, {row: this.currentPiece.rowInBoard+1, col: this.currentPiece.colInBoard})) {
			this.board.consumePiece(this.currentPiece);
			this.addRandomPiece();
		} else if(this.currentPiece) {
			++ this.currentPiece.rowInBoard;
		}

		var self = this;
                this.board.render(function (isGameOver) {
                        if(!isGameOver) {
                                self._ping();
                        } else {
                                alert("Game Over!!");
                        }
                });
	}
};
(function () {
	Tetris.start();
}());
