export function movePoint(lat, lng, speed, heading) {
    const earthRadius = 6378137;
    const distance = speed / 3.6; // km/h → m/s
  
    const rad = Math.PI / 180;
  
    const newLat = lat + (distance * Math.cos(heading * rad)) / earthRadius * (180 / Math.PI);
    const newLng = lng + (distance * Math.sin(heading * rad)) /
                   (earthRadius * Math.cos(lat * rad)) * (180 / Math.PI);
  
    return { latitude: newLat, longitude: newLng };
  }