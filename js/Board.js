var Board = function (size, char) {
	this.size = size;
	this.char = char;

	this._initBoardElement();
	this._initPixels();
};

$.extend(Board.prototype, {

	_renderStr: "",

	_initBoardElement: function () {
		this._boardElement = $("<div>").appendTo($("body"));
	},

	_initPixels: function () {
		this.pixels = Util.make2DArray(this.size);
	},

	_makeEmptyArray: function (size) {
		var arr = [], index;
		for(index = 0; index < size; index++) {
			arr.push(0);
		}

		return arr;
	},

	render: function (gameOverCallback) {
		var size = this.size,
			row, col;

		this._renderStr = "";

		for(row = 0; row < size+1; row++) {
			for(col = -1; col < size+1; col++) {
				this._addToRenderStr(row, col);
			}
		}
		this._boardElement.html(this._renderStr);
		if(gameOverCallback) {
                        gameOverCallback(this.isGameOver());
                }
	},

	_isAWall: function (point) {
		return (point === -1 || this._isEnd(point));
	},

	_isEnd: function (point) {
		return (point === this.size);
	},

	_isInLimit: function (arr, idx) {
		if(!arr) {
			return false;
		}

		return(idx >= 0 && idx < arr.length);
	},

	_getRelativePiecePix: function (row, col) {
		if(!this.currentPiece) {
			return 0;
		}

		var piece = this.currentPiece, 
			currentPieceMatrix = piece.matrix, 
			pieceRow = piece.rowInBoard, 
			pieceCol = piece.colInBoard, 
			relativeRow = row-pieceRow, 
			relativeCol = col-pieceCol;

		if(this._isInLimit(currentPieceMatrix, relativeRow) && this._isInLimit(currentPieceMatrix, relativeCol)) {
			return currentPieceMatrix[relativeRow][relativeCol];
		}

		return 0;
	},

	_addToRenderStr: function (row, col) {
		if(this._isAWall(row) || this._isAWall(col)) {
			this._renderStr += this.char;
			if(this._isEnd(col)) {
				this._renderStr += "<br />";
			}
		} else {
			if(this._getRelativePiecePix(row, col) || this.pixels[row][col]) {
				this._renderStr += this.char;
			} else {
				this._renderStr += "&nbsp;&nbsp;";
			}
		}
	},

	getNormalizedBoardPixelAt: function (row, col) {
		var boardPx = 1;
		try {
			boardPx = this.pixels[row][col];
		} catch(e) {
		}

		if(isNaN(boardPx)) {
			boardPx = 1;
		}

		return boardPx;
	},

	hitTest: function (piece, pos) {
		var posInput = pos? pos: {},
			rowInBoard = posInput.row? posInput.row: piece.rowInBoard,
			colInBoard = posInput.col? posInput.col: piece.colInBoard,
			size = piece.size,
			row, col, px, boardPx;

		for(row = 0; row < size; row++) {
			for(col = 0; col < size; col++) {
				boardPx = this.getNormalizedBoardPixelAt(rowInBoard+row, colInBoard+col);
				try {
					px =  piece.matrix[row][col];
				} catch(e) {
					px = 0;
				}
				if(boardPx && px) {
					return true;
				} else if (this._isAWall(row) && px) {
					return true;
				} else if(this._isEnd(col) && px) {
					return true;
				}
			}
		}

		return false;
	},

	consumePiece: function (piece) {
		var rowInBoard = piece.rowInBoard,
			colInBoard = piece.colInBoard,
			size = piece.size,
			row, col;

		for(row = 0; row < size; row++) {
			for(col = 0; col < size; col++) {
				if(piece.matrix[row][col]) {
					this.pixels[rowInBoard+row][colInBoard+col] = piece.matrix[row][col];
				}
			}
		}

		this.spliceFinishedRows();
	},

	_getRowPixelCount: function (arr) {
		var cnt = 0;

		$.each(arr, function (idx, pix) {
			cnt += pix;
		});

		return cnt;
	},

	isRowFinished: function (arr) {
		var len = arr.length, 
			cnt = this._getRowPixelCount(arr);
		return len === cnt;
	},

	isGameOver: function () {
		return this._getRowPixelCount(this.pixels[0]) !== 0;
	},


	spliceFinishedRows: function () {
		var row = 0, 
			pixels = this.pixels, 
			size = pixels.length, 
			splicedCount = 0;
		
		for(row = size-1; row >= 0; row--) {
			if(this.isRowFinished(pixels[row])) {
				pixels.splice(row, 1);
				splicedCount ++;
			}
		}

		for(row = 0; row < splicedCount; row ++) {
			pixels.unshift(Util.makeEmptyArray());
		}
	},

	addPiece: function (piece, consumedCallback) {
		this.currentPiece = piece;
	}
});
