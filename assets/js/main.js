// puzzle
// how it works
// dynamically generate images on the page (like cards from memory game)
	// grab each image from the assets folder dynamically
	// set information for each image dynamically
		// function (arrayOfImages) {
		// return imageArray;
		// }
// create event listeners for dragging and dropping the images into place
// time how ong it takes to win
// display a modal upon winning
// reset the game upon btn click
//	refactor the puzzle to allow for pieces to be rotated
	// add an event listener to rotate the piece when the L/R arrows are pressed
	// add a finalRotation to the images
	// check that image is properly rotated before allowing it to place

// example of the KIND of object we will need:
	// var createImgObj = function() {
	// 	var imgObj = [
	// 		{
	// 			src: "assets/img/cat_01.jpg",
	// 			finalPosX: 100, //sets x at 100px
	// 			finalPosY: 100,	//sets y at 100px
	// 		},
	// 		{
	// 			src: "assets/img/cat_01.jpg",
	// 			finalPosX: 300, //moves over by 200px
	// 			finalPosY: 100,
	// 		},
	// 	];


	// 	return imgObj;
	// }

// BUT LETS SAY WE DONT ALREADY KNOW THE MAGIC NUMBERS. What would we need to set the x&y?
	// path to images
	// width & height of each
	// number of pieces
	// number of columns
	// position of previous will be given by createImgObj stuff


// SO WHAT DO WE NEED TO MAKE THIS ARRAY?
// 1) make a loop
	// 	calculate the final positions
	// 	write out the src
	// 	push new obj to the array 


var createImgObj = function (imgData) {
	var imgObj = [];
	
	var positionX = 100;
	var positionY = 100;
	var columnCount = 1;

	//make a loop
	for (var i = 1; i <= imgData.numOfImgs; i++) {
		var currentImg = {
			src: imgData.path + i + imgData.ext,
			finalPosX: positionX,
			finalPosY: positionY,
		};
		imgObj.push(currentImg);

		if ( columnCount != imgData.numOfCols) {
			positionX = positionX + imgData.width;
			columnCount++;
		} else {
			columnCount = 1;
			positionX = 100;
			positionY += imgData.width;
		}
	}
	return imgObj;
}

var startGame = function () {
	//path to images
	var imgDefaultData = {
		path: "./assets/img/cat_",
		ext: ".jpg",
		width: 200,
		numOfImgs: 6,
		numOfCols: 3,
	};
	var imgArray = createImgObj(imgDefaultData);

	placePieces(imgArray);

	window.addEventListener("mousemove", movePiece);
	window.addEventListener("mouseup", stopDrag);
	window.addEventListener("keyup", rotatePiece);
}

var placePieces = function (imgArray) {
	for (var i = imgArray.length - 1; i >= 0; i--) {
		var piece = document.createElement("img");
		var rotation = ( Math.round( Math.random() * 3 ) * 90 );
		piece.setAttribute("class", "piece");
		piece.setAttribute("data-final-x", imgArray[i].finalPosX);
		piece.setAttribute("data-final-y", imgArray[i].finalPosY);
		piece.setAttribute("src", imgArray[i].src);
		piece.setAttribute("data-rotation", rotation );
		piece.style.top = (Math.random() * 350) + 50 + "px";
						//anywhere from 0 to 499.999999
		piece.style.left = (Math.random() * 250) + 750 + "px";
		piece.style.transform = "rotate(" + rotation + "deg)";

		document.body.appendChild(piece);

		piece.addEventListener("mousedown", startDrag);
	}
}

var startDrag = function(e) {
	e.preventDefault();

	if (!e.currentTarget.classList.contains( "locked" ) ) { 
		pieceBeingDragged = e.currentTarget;

		pieceBeginLeft = parseInt(pieceBeingDragged.style.left);
		pieceBeginTop = parseInt(pieceBeingDragged.style.top);

		mouseBeginLeft = e.clientX;
		mouseBeginTop = e.clientY;
	}

}

var movePiece = function(e) {
	
	if(pieceBeingDragged) {
		var distanceLeft = e.clientX - mouseBeginLeft;
		var distanceTop = e.clientY - mouseBeginTop;
		pieceBeingDragged.style.left = pieceBeginLeft + distanceLeft + "px";
		pieceBeingDragged.style.top = pieceBeginTop + distanceTop + "px";
	}
}

var rotatePiece = function(e) {
	if (pieceBeingDragged) {
		console.log(e);
		// e.preventDefault();
		
		var rotation = parseInt(pieceBeingDragged.dataset.rotation);

		
		// left = -90deg = a = 65
		// right = +90deg = d = 68
		
		if (e.keyCode == 65) {  //ROTATE LEFT
			
			rotation -= 90;

			if ( rotation == 360 ) {
				rotation == 0;
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			} else if ( rotation == -90 ) {
				rotation == 270;
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			} else {
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			}
		} else if (e.keyCode == 68) {	//ROTATE RIGHT

			rotation += 90;

			if ( rotation == 360 ) {
				rotation == 0;
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			} else if ( rotation == -90 ) {
				rotation == 270;
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			} else {
				pieceBeingDragged.style.transform = "rotate(" + ( rotation ) + "deg)";
			}
		}		
	}
}

var stopDrag = function(e) {
	if (pieceBeingDragged) {
		checkForFit(pieceBeingDragged);	
		pieceBeingDragged = null;
	}
}

var checkForFit = function (lastDraggedPiece) {
	var currentLeft = parseInt(lastDraggedPiece.style.left);
	var currentTop = parseInt(lastDraggedPiece.style.top);
	var finalLeft = parseInt(lastDraggedPiece.dataset.finalX);
	var finalTop = parseInt(lastDraggedPiece.dataset.finalY);

	if ( Math.abs( currentLeft - finalLeft ) <= 20 && 
		( Math.abs( currentTop - finalTop ) <= 20 ) ) {
		lastDraggedPiece.style.left = finalLeft + "px";
		lastDraggedPiece.style.top = finalTop + "px";	
		lastDraggedPiece.classList.add( "locked" );
	}
}

var pieceBeingDragged, 
	pieceBeginLeft,
	pieceBeginTop,
	mouseBeginLeft,
	mouseBeginTop;


startGame();


// HOMEWORK: 

// create function to check (on stopdrag) if piecebeing dragged is within 20px of its finalposx and 20px of finalPosY
// 	if it is, add the class locked and snap it into position (set x and y equal to finalx finaly)
