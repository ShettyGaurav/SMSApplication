// app.js
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./model/user.js"; // Import your User model
import client from "./model/client.js";

import message from './routes/message.js'

const app = express();
app.use(express.json());
app.use(cors());
mongoose
  .connect(
    ""
  )
  .then(() => {
    console.log("DB connected");
  });

// 
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user and save to the database
    const user = new User({ email, password: hashedPassword });
    await user.save(); // Respond with a success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  console.log("Succesfully hitted route");
  const { email, password } = req.body;

  try {
    // Find user by email in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Store user ID and email in session
    // req.session.userId = user.id;
    // req.session.email = user.email;

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/clients/edit", async (req, res) => {
  const { phone, newName, newPhone } = req.body;

  try {
    // Check if the client with the provided phone number exists
    const existingClient = await client.findOne({ phone });
    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Check if the new phone number is already taken by another client
    if (newPhone && newPhone !== phone) {
      const phoneTaken = await client.findOne({ phone: newPhone });
      if (phoneTaken) {
        return res.status(400).json({ error: "New phone number is already in use" });
      }
    }

    // Update the client's details
    existingClient.name = newName || existingClient.name;
    existingClient.phone = newPhone || existingClient.phone;

    await existingClient.save();

    // Fetch all clients to return as response
    const clients = await client.find({});
    res.status(200).json({ message: "Client updated successfully", clients });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/clients/add", async (req, res) => {
  console.log("Server hit to add client");
  const { name, phone } = req.body;
  try {
    const existingClient = await client.findOne({ phone });
    if (existingClient) {
      console.log("Client existed with same number");
      return res.status(400).json({ error: "Client already enrolled" });
    }
    // Create a new user and save to the database
    const user = new client({ name: name, phone: phone });
    await user.save(); // Respond with a success message
    const clients = await client.find({});
    res.status(201).json({ message: "Client Added successfully",clients:clients });
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/clients/remove",async (req,res)=>{
    const {phone} = req.body
    const result = await client.deleteOne({ phone: phone });
    const clients = await client.find({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' ,clients:clients});
    }

    // Respond with a success message
    return res.status(200).json({ message: 'User deleted successfully',clients:clients});
})

app.get("/get-all-clients",async (req,res)=>{
    try {
      const clients = await client.find({});
    res.status(200).json(clients)
    } catch (error) {
      console.log(error);
    }    
})

app.use('/message',message)


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
