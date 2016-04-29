var ws;
var isConnected = false;

var lowerDepthRange = 0;
var upperDepthRange = 1;
var maskingColorRed = 2;
var maskingColorGreen = 3;
var maskingColorBlue = 4;
var maskingColorDistance = 5;
var maskingColorAuto = 6;

var ref = new Firebase("https://kromakey.firebaseio.com/data");
//Setup web socket client for communication 
function setupSocketClient(){

	ref.on("value", function(snapshot) {
	  var value = snapshot.val();
	  var IP = value.host_ip;
	  ws = new WebSocket(IP);
	//ws = new WebSocket("ws://130.236.124.119:8080/echo");

		ws.onmessage = function(evt){
			console.log(evt.data);
			$("#depth-range-lower").slider('value',50);
		};

		ws.onopen = function(evt){
			isConnected = true;
		}
	  
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
}

//Add UI elements
function setupUIElements() {
    $("#depth-range-lower").on("change", function(){
	    sendMessage(lowerDepthRange, $(this).val());
	});

	$("#depth-range-higher").on("change", function(){
	    sendMessage(upperDepthRange, $(this).val());
	});

	$("#color-tolerance").on("change", function(){
	    sendMessage(maskingColorDistance, $(this).val());
	});

	$("#masking-color-red").on("change", function(){
	    sendMessage(maskingColorRed, $(this).val());
	    $("#mixed-color").css('background', "rgb("+
    		$("#masking-color-red").val()+","+
    		$("#masking-color-green").val()+","+
    		$("#masking-color-blue").val()+")");
	});

	$("#masking-color-green").on("change", function(){
	    sendMessage(maskingColorGreen, $(this).val());
	    $("#mixed-color").css('background', "rgb("+
    		$("#masking-color-red").val()+","+
    		$("#masking-color-green").val()+","+
    		$("#masking-color-blue").val()+")");
	});

	$("#masking-color-blue").on("change", function(){
	    sendMessage(maskingColorBlue, $(this).val());
	    $("#mixed-color").css('background', "rgb("+
    		$("#masking-color-red").val()+","+
    		$("#masking-color-green").val()+","+
    		$("#masking-color-blue").val()+")");
	});
}


window.onload = function(){
	setupUIElements();
	setupSocketClient();
	
}


window.onclose = function(){
  ws.close();
}