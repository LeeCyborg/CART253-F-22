/*
MQTT template 
CART253, Creative Computation, Fall 2022
Concordia University
l wilkins



We are using the Eclipse Paho MQTT client library: https://www.eclipse.org/paho/clients/js/ to create an MQTT client that sends and receives messages. The client is set up for use on the shiftr.io test MQTT broker (https://shiftr.io/try)

*/



// MQTT client details. We are using a public server called shiftr.io. Don't change this. 
let broker = {
  hostname: 'public.cloud.shiftr.io',
  port: 443
};
let client;
let creds = {
  clientID: 'p5Client', 
  userName: 'public', 
  password: 'public' 
}
let topic = 'CART253'; // This is the topic we are all subscribed to
// End of MQTT client details 



function setup() {
  // Normal program setup goes here
  createCanvas(800, 400);
  MQTTsetup(); // Setup the MQTT client
}

function draw() {
  background(50);
}

function mousePressed(){ 
  // Sends a message on mouse pressed to test. You can use sendMQTTMessage(msg) at any time, it doesn't have to be on mouse pressed. 
  sendMQTTMessage(10); // This function takes 1 parameter, here I used a random number between 0 and 255 and constrained it to an integer. You can use anything you want.
}


// Sending a message like this: 
function sendMQTTMessage(msg) {
      message = new Paho.MQTT.Message(String(msg)); // Make your message a string and send it 
      message.destinationName = topic;
      console.log("Message Sent!");
      client.send(message); // send message
}


// When a message arrives, do this: 
function onMessageArrived(message) {
  console.log("Message Received:");
  console.log(message.payloadString); // Print the incoming message

  // You can do something like this to compare. Dont' forget to make it an int
  if(int(message.payloadString) == 10){
    console.log("yup");
  } 
}

// Callback functions
function onConnect() {
  client.subscribe(topic);
  console.log("connected");
  // is working
}
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    // If it stops working
  }
}
function MQTTsetup(){
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({
        onSuccess: onConnect,
    userName: creds.userName, // username
    password: creds.password, // password
    useSSL: true
  });
}