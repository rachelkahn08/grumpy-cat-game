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
	var initialX = 325;
	var initialY = 150;

	//make a loop
	for (var i = 1; i <= imgData.numOfImgs; i++) {
		var currentImg = {
			src: imgData.path + i + imgData.ext,
			finalPosX: positionX,
			finalPosY: positionY,
			initialX: initialX,
			initialY: initialY,
		};

		imgObj.push(currentImg);

		if ( columnCount != imgData.numOfCols) {
			positionX = positionX + imgData.width;
			initialX = initialX + imgData.width;
			columnCount++;
		} else {
			columnCount = 1;
			positionX = 100;
			initialX = 325;
			positionY += imgData.width;
			initialY += imgData.width;
		}
	}
	return imgObj;
}

var startGame = function () {
	
	setTimeout(function() {	
		puzzleFrame = document.createElement("div");
			puzzleFrame.setAttribute("id", "frame");
			document.body.appendChild(puzzleFrame);

		var directionsA = document.createElement("div");
			directionsA.setAttribute("class", "directions-a");
			directionsA.innerHTML = "rotate left with a";
			puzzleFrame.appendChild(directionsA);

		var directionsD = document.createElement("div");
			directionsD.setAttribute("class", "directions-d");
			directionsD.innerHTML = "rotate right with d";
			puzzleFrame.appendChild(directionsD);
	}, 1500);

	window.addEventListener("mousemove", movePiece);
	window.addEventListener("mouseup", stopDrag);
	window.addEventListener("keyup", rotatePiece);
}

var placePieces = function (imgArray) {
	for (var i = imgArray.length - 1; i >= 0; i--) {
		var piece = document.createElement("img");
			piece.setAttribute("class", "piece");
			piece.setAttribute("data-final-x", imgArray[i].finalPosX);
			piece.setAttribute("data-final-y", imgArray[i].finalPosY);	
			piece.setAttribute("data-initial-x", imgArray[i].initialX);
			piece.setAttribute("data-initial-y", imgArray[i].initialY);
			piece.setAttribute("src", imgArray[i].src);
			
		piece.style.top = piece.dataset.initialY + "px";
		piece.style.left = piece.dataset.initialX + "px";
		piece.addEventListener("mousedown", startDrag);

		document.body.appendChild(piece);
	}

}

var scatterPieces = function(imgArray) {
	var piecesArray = [];
	var piecesList = document.querySelectorAll(".piece");
	
	for (var i = piecesList.length - 1; i >= 0; i--) {
		piecesArray.push(piecesList[i]);
	}

	for (var i = piecesArray.length - 1; i >= 0; i-- ) {
		var tweenTop = (Math.random() * 350) + 50;
		var tweenLeft = (Math.random() * 250) + 750;
		var tweenRotation = ( Math.round( Math.random() * 3 ) * 90 );

		var piece = piecesArray[i];

		TweenMax.to ( piece, 1.5, {
			top: tweenTop,
			left: tweenLeft,
			rotation: tweenRotation,
			})

		piece.setAttribute("data-rotation", tweenRotation );
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

		e.preventDefault();
		var currentRotation = parseInt(pieceBeingDragged.dataset.rotation);

		// left = -90deg = a = 65
		// right = +90deg = d = 68
		if ( e.keyCode == 65 && currentRotation != 0 ) { //ROTATE LEFT 			
			currentRotation -= 90;
			updateRotation();
		} else if ( e.keyCode == 65 && currentRotation == 0 ) {
			currentRotation += 270;
			updateRotation();
		} else if ( e.keyCode == 68 && currentRotation != 360 ) {
			currentRotation += 90;
			updateRotation();
		} else if ( e.keyCode == 68 && currentRotation == 360 ) {
			currentRotation -= 270;
			updateRotation();
		}

		function updateRotation() {
			pieceBeingDragged.dataset.rotation = currentRotation;
			pieceBeingDragged.style.transform = "rotate(" + ( currentRotation ) + "deg)";
		}
	}
}


var stopDrag = function(e) {
	if (pieceBeingDragged) {
		checkForFit(pieceBeingDragged);	
		checkForWin(pieceBeingDragged);
		pieceBeingDragged = null;
	}
}

var checkForFit = function (lastDraggedPiece) {
	var currentLeft = parseInt(lastDraggedPiece.style.left);
	var currentTop = parseInt(lastDraggedPiece.style.top);
	var finalLeft = parseInt(lastDraggedPiece.dataset.finalX);
	var finalTop = parseInt(lastDraggedPiece.dataset.finalY);
	var rotation = parseInt(lastDraggedPiece.dataset.rotation);

	if ( Math.abs( currentLeft - finalLeft ) <= 20 && 
		( Math.abs( currentTop - finalTop ) <= 20 ) ) 
	if ( lastDraggedPiece.dataset.rotation == 0 | lastDraggedPiece.dataset.rotation == 360 ) {
		lastDraggedPiece.style.left = finalLeft + "px";
		lastDraggedPiece.style.top = finalTop + "px";	
		lastDraggedPiece.classList.add( "locked" );
	}
}

var pieceBeingDragged, 
	pieceBeginLeft,
	pieceBeginTop,
	mouseBeginLeft,
	mouseBeginTop,
	puzzleFrame;

var createModal = function (modal) {
	var modal = document.createElement("div");
	modal.setAttribute("class", "modal");
	document.body.appendChild(modal);

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


	return modal;
}

var addMessage = function (message) {
	var message = document.createElement("div");
	message.setAttribute("class", "message");
	document.body.appendChild(message);

	return message;
}

var addButton = function (button) {
	var button = document.createElement("div");
	button.setAttribute("class", "button");
	document.body.appendChild(button);

	return button;
}

var createStopwatch = function (stopwatch) {
	stopwatch = document.createElement("div");
	stopwatch.setAttribute("class", "stopwatch");

		var minutesContainer = document.createElement( "div" );
			stopwatch.appendChild(minutesContainer);
			minutesContainer.setAttribute( "class", "minutes" );
			minutesContainer.innerHTML = "00";
			
		var secondsContainer = document.createElement( "div" );
			stopwatch.appendChild(secondsContainer);
			secondsContainer.setAttribute( "class", "seconds" );
			secondsContainer.innerHTML = ":00";

		var hundredthsContainer = document.createElement( "div" );
			stopwatch.appendChild(hundredthsContainer);
			hundredthsContainer.setAttribute( "class", "hundredths" );
			hundredthsContainer.innerHTML = ".0";

	return { stopwatch: stopwatch, 
		minutesContainer: minutesContainer,
		secondsContainer: secondsContainer,
		hundredthsContainer: hundredthsContainer,
	};
}

var stopwatchInterval;
	var hundredths = 0;
	var seconds = 0;
	var minutes = 0;

var runStopwatch = function() {
	
	hundredths++ 

	if ( hundredths > 99 ) {
		hundredths = 0;
		seconds++;
	}

	if ( seconds > 59 ) {
		seconds = 0;
		minutes++; 
	}
}

var appendStopwatch = function (e) {

	var stopwatch = createStopwatch();	
		
		if ( minutes < 10 ) {
			stopwatch.minutesContainer.innerHTML = "0" + minutes + ":";
		} else { 
			stopwatch.minutesContainer.innerHTML = minutes + ":";
		}
		
		if ( seconds < 10 ) {
			stopwatch.secondsContainer.innerHTML = "0" + seconds + ":";
		} else {
			stopwatch.secondsContainer.innerHTML = seconds + ":";
		}

		if ( hundredths < 10 ) {
			stopwatch.hundredthsContainer.innerHTML = "0" + hundredths;
		} else {
			stopwatch.hundredthsContainer.innerHTML = hundredths;
		}

	createStopwatch(); 

	e.appendChild(stopwatch.stopwatch);
}

var buttonClick = function () {
	
	if ( hundredths > 0 | seconds > 0 | minutes > 0 ) {
		hundredths = 0;
		seconds = 0;
		minutes = 0;
	}

	stopwatchInterval = setInterval(runStopwatch, 10)

	modal = document.querySelector(".modal");
		while (modal.hasChildNodes()) {
			modal.removeChild(modal.lastChild);
		}

		modal.style.background = "transparent";

	TweenMax.to(".modal", 1.5, 
		{ 	top: "98px",
			left: "98px", 
			transform: "(0 0)",
		}
	)

	setTimeout( function() {
		modal.parentNode.removeChild(modal);
	}, 1500);


	var imgArray = 
	scatterPieces(imgArray);
	
	startGame();
}

var appendOpeningModal = function () {

	var modal = createModal();
	var message = addMessage();
	var button = addButton();
		button.innerHTML = "BEGIN.";

	modal.appendChild(message);
	modal.appendChild(button);

	message.innerHTML = "I'M A PUZZLE";
	button.addEventListener("click", buttonClick);

}

var appendContinuingModal = function () {

	var modal = createModal();
	var message = addMessage();
	var button = addButton();
		button.innerHTML = "AGAIN";
	
	appendStopwatch(modal);

	modal.appendChild(message);
	modal.appendChild(button);

	message.innerHTML = "YOUR TIME:";
	button.addEventListener("click", buttonClick);

}

var checkForWin = function () {
	if ( document.querySelectorAll(".piece").length == document.querySelectorAll(".locked").length) {
		clearInterval( stopwatchInterval );
		var good = function() {
			var text = document.createElement("div");
				text.setAttribute("class", "good");
				text.innerHTML = "GOOD.";
				document.body.appendChild(text);
		}
		good();
		setTimeout(onWin, 3000);
	}
}

var onWin = function () {
	lockedPiece = document.querySelectorAll(".locked");
		i = 0;
		while (i < lockedPiece.length) {
			lockedPiece[i].parentNode.removeChild(lockedPiece[i]);
			i++;
		}

	var text = document.querySelector(".good");
	text.parentNode.removeChild(text);

	puzzleFrame.parentNode.removeChild(puzzleFrame);
	appendContinuingModal();
}

window.addEventListener("load", appendOpeningModal);


// HOMEWORK: 

// create function to check (on stopdrag) if piecebeing dragged is within 20px of its finalposx and 20px of finalPosY
// 	if it is, add the class locked and snap it into position (set x and y equal to finalx finaly)
