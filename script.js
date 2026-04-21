const BROKER_URL = "wss://edbcd9b6dd544a09baf53908d733c3bd.s1.eu.hivemq.cloud:8884/mqtt";

let client;
let currentRequestId = null;

function connectMQTT() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  client = mqtt.connect(BROKER_URL, {
    username: username,
    password: password
  });

  client.on("connect", () => {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("mainUI").style.display = "block";

    document.getElementById("connStatus").innerText = "Connected";
    document.getElementById("connStatus").className = "status online";

    client.subscribe("robot/fire_request");
    client.subscribe("robot/status");

    log("Connected to MQTT");
  });

  client.on("error", (err) => {
    alert("Connection failed");
    console.log(err);
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
}

function sendApproval(value) {
  if (currentRequestId === null) return;

  client.publish("robot/fire_approval", JSON.stringify({
    request_id: currentRequestId,
    approved: value
  }));

  log("Approval sent: " + value);
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.textContent = msg + "\n" + logBox.textContent;
}