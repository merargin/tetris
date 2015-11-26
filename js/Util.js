var Util = {
	make2DArray: function (size) {
		var arr = [], index;

		for(index = 0; index < size; index++) {
			arr.push(this.makeEmptyArray(size));
		}

		return arr;
	},
	
	makeEmptyArray: function (size) {
		var arr = [], index;
		for(index = 0; index < size; index++) {
			arr.push(0);
		}

		return arr;
	}
};
