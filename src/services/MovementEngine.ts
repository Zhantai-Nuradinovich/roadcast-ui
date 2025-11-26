export function movePoint(lat: number, lng: number, speedKmh: number, headingDeg: number, deltaSeconds = 1) {
  const earthRadius = 6378137; // meters
  const speedMs = (speedKmh * 1000) / 3600; // m/s
  const distance = speedMs * deltaSeconds; // meters to move this tick

  const headingRad = headingDeg * Math.PI / 180;
  const dLat = (distance * Math.cos(headingRad)) / earthRadius;
  const dLng = (distance * Math.sin(headingRad)) / (earthRadius * Math.cos(lat * Math.PI / 180));

  const newLat = lat + dLat * (180 / Math.PI);
  const newLng = lng + dLng * (180 / Math.PI);

  return { latitude: newLat, longitude: newLng };
}
