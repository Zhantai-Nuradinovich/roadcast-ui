import * as signalR from "@microsoft/signalr";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const geoHub = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE}/hubs/geo`, {
    accessTokenFactory: () => localStorage.getItem("jwt") || ""
  })
  .withAutomaticReconnect()
  .build();

export const dmHub = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE}/hubs/direct`, {
    accessTokenFactory: () => localStorage.getItem("jwt") || ""
  })
  .withAutomaticReconnect()
  .build();

export async function startHubs() {
  try {
    await geoHub.start();
    console.log("geoHub connected");
  } catch (e) {
    console.warn("geoHub start failed", e);
    setTimeout(startHubs, 2000);
  }
  try {
    await dmHub.start();
    console.log("dmHub connected");
  } catch (e) {
    console.warn("dmHub start failed", e);
  }
}
