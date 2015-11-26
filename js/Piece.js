/* Matrix of a piece is a 4 x 4 bit representation of the piece. */
var Piece = function (matrix, boardSize) {
	this.boardSize = boardSize;

	this.rowInBoard = 0;
	this.colInBoard = 8;

	this.matrix = matrix;
};

$.extend(Piece.prototype, {

	size: 4,

	left: function () {
		this.colInBoard--;
	},

	right: function () {
		this.colInBoard++;
	},

	counter: function () {
		var row, col, matrix = this.matrix, size = this.size, rotated = Util.make2DArray(size);
                
		for (col = 0; col < size; col++) {
                        for (row = 0; row < size; row++) {
                                rotated[row][col] = matrix[col][size -row -1];
                        }       
                }               
                                
                this.matrix = rotated;
	},
	
	rotate: function () {
		var row, col, matrix = this.matrix, size = this.size, rotated = Util.make2DArray(size);

		for (row = 0; row < size; row++) {
			for (col = 0; col < size; col++) {
				rotated[row][col] = matrix[size -col -1][row];
			}
		}

		this.matrix = rotated;
	}
});
