var ws;
var isConnected = false;

var maskingColorRed = 0;
var maskingColorGreen = 1;
var maskingColorBlue = 2;
var maskingColorDistance = 3;
var maskingColorAuto = 4;

var ref = new Firebase("https://kromakey.firebaseio.com/data");
//Setup web socket client for communication 
function setupSocketClient(){

	ref.on("value", function(snapshot) {
	  var value = snapshot.val();
	  var IP = value.host_ip;
	  ws = new WebSocket(IP);
	//ws = new WebSocket("ws://130.236.124.119:8080/echo");

		ws.onmessage = function(evt){
			
			var res = evt.data.split(";").map(Number);
			
			changeUIElements(res[0], res[1]);

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
function changeUIElements(index, val) {
   switch(index){
   	case maskingColorRed:
   		$( "#masking-color-red" ).val( val );
   	break;
   	case maskingColorGreen:
   		$( "#masking-color-green" ).val( val );
   	break;
   	case maskingColorBlue:
   		$( "#masking-color-blue" ).val( val );
   	break;
   	case maskingColorDistance:
   		$( "#color-tolerance" ).val( val );
   	break;
   }
}


window.onload = function(){
	setupUIElements();
	setupSocketClient();
	
}


window.onclose = function(){
  ws.close();
}