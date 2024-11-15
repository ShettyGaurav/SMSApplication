import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import cors from "cors";
import clientModel from "../model/client.js";

const app = express();
dotenv.config();

app.use(cors());
// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send SMS
async function sendMessage(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("Message sent successfully! SID:", response.sid);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

// Example usage
app.post("/send", (req, res) => {
  const { phone } = req.body;
  try {
    sendMessage(`${phone}`, "Hello from your Node.js app!");
    res.status(200).json("Sent successfully");
  } catch (err) {
    console.log(err);
  }
});
app.get("/send-all", async (req, res) => {
  try {
    const clients = await clientModel.find({});
    clients.map((client) => {
      sendMessage(`${client.phone}`, "Hello from your Node.js app!");
    });

    res.status(200).json("Message sent to all client");
  } catch (error) {
    console.log(error);
    res.status(500).json("Problem while sending message to all users");
  }
});

export default app;
