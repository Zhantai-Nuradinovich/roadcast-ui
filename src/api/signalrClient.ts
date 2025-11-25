import * as signalR from "@microsoft/signalr";

export const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/geohub")
  .withAutomaticReconnect()
  .build();

export async function startConnection() {
  try {
    await hubConnection.start();
    console.log("Connected to SignalR");
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    setTimeout(startConnection, 2000);
  }
}