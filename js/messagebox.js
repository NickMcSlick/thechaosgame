//start message
var start_message = [
    
    'Hello, Please Start by Making a Selection of Points (Below)! <br/> How Many Points Would You Like To Choose?'
    
]
//onload/refresh start message will reappear
window.onload = document.getElementById('messages').innerHTML = start_message;



//(Start)Test To See Ability to add other messages into box
var After_Start = ['good work']

function GO(){

setTimeout(() => { document.getElementById('messages').innerHTML = After_Start;}, 2000); 

}

GO();
//(Finish) All between start and finish is temp