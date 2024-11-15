import React, { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import './css/ClientLists.css'

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const nameRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    async function getClients() {
      try {
        const fetchClients = await axios.get(
          "http://localhost:3000/get-all-clients"
        );
        console.log(fetchClients.data);
        setClients(fetchClients.data);
      } catch (err) {
        console.log(err);
      }
    }
    getClients();
  }, []);

  const handleEdit = async (phone) => {
    try {
      if (phone && phoneRef.current.value && nameRef.current.value) {
        const data = {
          phone: phone,
          newPhone: phoneRef.current.value,
          newName: nameRef.current.value,
        };

        const response = await axios.post(
          "http://localhost:3000/clients/edit",
          data
        );
        if (response.data.clients) {
          setClients(response.data.clients);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const sendEvery = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/message/send-all"
      );
      console.log(response.data);
      alert(response.data);
    } catch (err) {
      alert("Error sending message to all clients");
    }
  };

  const handleAddClient = async () => {
    const data = { name: nameRef.current.value, phone: phoneRef.current.value };
    if (!data.name || !data.phone) {
      return alert("No name or phone number Entered");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/clients/add",
          data
        );
        console.log(response.data.message);
        if (response.data.clients) {
          setClients(response.data.clients);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleDelete = async (phone) => {
    const data = { phone: phone };
    try {
      const response = await axios.post(
        "http://localhost:3000/clients/remove",
        data
      );
      console.log(response.data.message);
      if (response.data.clients) {
        setClients(response.data.clients);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = async (phone) => {
    try {
      const response = await axios.post("http://localhost:3000/message/send", {
        phone: phone,
      });
      // alert(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div id="client-container">
      <input
        id="input"
        type="text"
        placeholder="Enter name of Client"
        ref={nameRef}
      />
      <input
        id="input"
        type="text"
        placeholder="Enter phone of a client"
        ref={phoneRef}
      />
      <button id="add-client-button" onClick={() => handleAddClient()}>
        Add Client
      </button>
      <button id="send-every-button" onClick={() => sendEvery()}>
        Send message to Every Client
      </button>
      {clients.map((client) => {
        return (
          <div id="client-card">
            <p id="name-para">{client.name}</p>
            <p id="phone-para">{client.phone}</p>
            <button id="client-phone-button" onClick={() => handleClick(client.phone)}>
              Send Message
            </button>
            <button id="client-delete-button" onClick={() => handleDelete(client.phone)}>
              Delete
            </button>
            <button id="client-edit-button" onClick={() => handleEdit(client.phone)}>
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ClientList;
