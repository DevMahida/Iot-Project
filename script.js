const BROKER_URL = "wss://edbcd9b6dd544a09baf53908d733c3bd.s1.eu.hivemq.cloud:8884/mqtt";
const USERNAME = "IotAdmin";
const PASSWORD = "IotAdmin@123#";

const client = mqtt.connect(BROKER_URL, {
  username: USERNAME,
  password: PASSWORD
});

let currentRequestId = null;

client.on("connect", () => {
  document.getElementById("connStatus").innerText = "Connected";
  document.getElementById("connStatus").className = "status online";

  client.subscribe("robot/fire_request");
  client.subscribe("robot/status");
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());

  log(topic + " -> " + message.toString());

  if (topic === "robot/status") {
    document.getElementById("robotStatus").innerText = data.status;
  }

  if (topic === "robot/fire_request") {
    currentRequestId = data.request_id;

    document.getElementById("requestText").innerText =
      "Request ID: " + data.request_id +
      " | Distance: " + data.distance_cm;
  }
});

function sendApproval(value) {
  if (currentRequestId === null) return;

  client.publish("robot/fire_approval", JSON.stringify({
    request_id: currentRequestId,
    approved: value
  }));

  log("Sent approval: " + value);
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.textContent = msg + "\n" + logBox.textContent;
}