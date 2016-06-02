var ws;
var isConnected = false;


// var maskingColorRed = 0;
// var maskingColorGreen = 1;
// var maskingColorBlue = 2;
var innerRadius = 3;
var outerRadius = 4;
// var maskingColorDistance = 5;
var maskingColorAuto = 6;
var innerDepthRadius = 7;
// var outerDepthRadius = 8;

var ref = new Firebase("https://kromakey.firebaseio.com/");

var dataRef = ref.child("data");

//Setup web socket client for communication
function setupSocketClient(){

	$( "div.connection-container" ).text( "Ansluter..." );
	$("div.connection-container").css('color', 'black');

	dataRef.on("value", function(snapshot) {
		var value = snapshot.val();
		var IP = value.host_ip;
		//ws = new WebSocket(IP);
		ws = new WebSocket("ws://192.168.1.29:8080/echo");

		ws.onmessage = function(evt){

			var res = evt.data.split(";").map(Number);

			changeUIElements(res[0], res[1]);

		};



		ws.onopen = function(evt){
			isConnected = true;
			$( "div.connection-container" ).text( "Ansluten" );
			$("div.connection-container").css('color', '#53BA30');
		};

		ws.onerror = function(evt){
			$( "div.connection-container" ).text( "Kunde inte ansluta" );
			$("div.connection-container").css('color', 'red');

		};

	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});


}

//Attr is the attribute to ed
function sendMessage(attr, value){
	if(isConnected){
		var msg = attr + ";" + value;
		ws.send(msg);
	}
	else
	{
		$( "div.connection-container" ).text( "Anslutning tappades" );
		$("div.connection-container").css('color', 'red');

	}

}

//Add UI elements
function setupUIElements() {


	// $("#color-tolerance").on("change", function(){
	//     sendMessage(maskingColorDistance, $(this).val());
	// });

	$("#inner-radius").on("change", function(){
		sendMessage(innerRadius, $(this).val());
	});

	$("#outer-radius").on("change", function(){
		sendMessage(outerRadius, $(this).val());
	});

	$("#inner-depth-radius").on("change", function(){

		sendMessage(innerDepthRadius, $(this).val());
	});
	// $("#outer-depth-radius").on("change", function(){
	//     sendMessage(outerDepthRadius, $(this).val());
	// });

	$("#controls").hide();

	// $("#masking-color-red").on("change", function(){
	//     sendMessage(maskingColorRed, $(this).val());
	//     $("#mixed-color").css('background', "rgb("+
	//    		$("#masking-color-red").val()+","+
	//    		$("#masking-color-green").val()+","+
	//    		$("#masking-color-blue").val()+")");
	// });

	// $("#masking-color-green").on("change", function(){
	//     sendMessage(maskingColorGreen, $(this).val());
	//     $("#mixed-color").css('background', "rgb("+
	//    		$("#masking-color-red").val()+","+
	//    		$("#masking-color-green").val()+","+
	//    		$("#masking-color-blue").val()+")");
	// });

	// $("#masking-color-blue").on("change", function(){
	//     sendMessage(maskingColorBlue, $(this).val());
	//     $("#mixed-color").css('background', "rgb("+
	//    		$("#masking-color-red").val()+","+
	//    		$("#masking-color-green").val()+","+
	//    		$("#masking-color-blue").val()+")");
	// });


}

function changeUIElements(index, val) {

	switch(index){
		// case maskingColorRed:
		// 	$( "#masking-color-red" ).val( val );
		// 	$( "#masking-color-red" ).slider("refresh");
		// break;
		// case maskingColorGreen:
		// 	$( "#masking-color-green" ).val( val );
		// 	$( "#masking-color-green" ).slider("refresh");
		// break;
		// case maskingColorBlue:
		// 	$( "#masking-color-blue" ).val( val );
		// 	$( "#masking-color-blue" ).slider( "refresh");
		// break;
		case innerDepthRadius:
		$( "#inner-depth-radius" ).val( val );
		$( "#inner-depth-radius" ).slider( "refresh");
		break;
		// case outerDepthRadius:
		// 	$( "#outer-depth-radius" ).val( val );
		// 	$( "#outer-depth-radius" ).slider("refresh");
		// break;
		case innerRadius:
		$( "#inner-radius" ).val( val );
		$( "#inner-radius" ).slider( "refresh");
		break;
		case outerRadius:
		$( "#outer-radius" ).val( val );
		$( "#outer-radius" ).slider("refresh");
		break;
		//  	case maskingColorDistance:
		//  		$( "#color-tolerance" ).val( val );
		// $( "#color-tolerance" ).slider("refresh");
		//  	break;
	}
}


function fabricsSettings(){

	//sendMessage(0, 41);
	//sendMessage(1, 210);
	//sendMessage(2, 93);
	sendMessage(3, 0.3*10000);
	sendMessage(4, 0.33*10000);
	// sendMessage(5, 24);
	sendMessage(7, 0.3*10000);
	//sendMessage(8, 0.33*10000);
}


function loginUser(){
	ref.authWithPassword({
		email    : $("#username").val(),
		password : $("#password").val()
	}, function(error, authData) {
		if (error) {
			$( "div.connection-container" ).text( "Felaktigt lösenord eller mailadress" );
			$("div.connection-container").css('color', 'red');
			console.log("Login Failed!", error);
		} else {
			$( "#controls" ).show();
			$( "#loginForm" ).hide();
			setupSocketClient();
			console.log("Authenticated successfully with payload:", authData);
		}
	});
}

window.onload = function(){
	setupUIElements();
	//setupSocketClient();

}


window.onclose = function(){
	ws.close();
}
