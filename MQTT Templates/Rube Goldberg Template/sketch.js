/*
Screen based Rube Goldberg machine template 
CART253, Creative Computation, Fall 2022
Concordia University
l wilkins

The goal of this project is to pass along a variable between programs to create a chain. Every person will get a number from someone else, use this number to create a piece of generative art, then pass along a new number to the next person.


We are using the Eclipse Paho MQTT client library: https://www.eclipse.org/paho/clients/js/ to create an MQTT client that sends and receives messages. The client is set up for use on the shiftr.io test MQTT broker (https://shiftr.io/try)

*/

// Rube Goldberg setup, update with your own info!
let myName = "lee"; // Who are you? Make sure it matches the previous person's variable! 
let nextName = "KM"; // Who is next on the list? Make sure it matches the next person's variable!
let dataToSend;  // Variable to hold the data to send to the next person on the list


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
  sendMQTTMessage(int(random(255))); // This function takes 1 parameter, here I used a random number between 0 and 255 and constrained it to an integer. You can use anything you want.
}

// When a message arrives, do this: 
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");// Split the incoming message into an array deliniated by "/"
  console.log("Message Received:");
  console.log(String(dataReceive[1])); 
// 0 is who its from
// 1 is who its for
// 2 is the data
  if(dataReceive[1] == myName){ // Check if its for me
    console.log("Its for me! :) ");
  } else {
    console.log("Not for me! :( ");
  }
}

// Sending a message
function sendMQTTMessage(msg) {
      message = new Paho.MQTT.Message(myName + "/" + nextName+"/"+msg); // add messages together: 
// My name + Next name + data separated by / 
      message.destinationName = topic;
      console.log("Message Sent!");
      client.send(message);
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