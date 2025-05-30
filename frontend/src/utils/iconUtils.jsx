import React from "react";

// Function to generate Material Icon images
export const generateIcon = (
  iconName,
  backgroundColor = "white",
  iconColor = "black",
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 64;
  canvas.height = 64;

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw circular background
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
    0,
    Math.PI * 2,
  );
  context.fillStyle = backgroundColor; // Background color
  context.fill();
  context.closePath();

  // Draw icon text
  context.font = "48px Material Icons";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = iconColor;
  context.fillText(iconName, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
};

// Mapping of types to colors and icon names
export const typeToIconMapping = {
  restaurant: { iconName: "restaurant", color: "#c9b60a" }, // Yellow background
  park: { iconName: "park", color: "#4CAF50" }, // Green background
  school: { iconName: "school", color: "#2196F3" }, // Blue background
  bank: { iconName: "account_balance", color: "#673AB7" }, // Purple background
  hospital: { iconName: "local_hospital", color: "#E91E63" }, // Pink background
  atm: { iconName: "credit_card", color: "#3F51B5" }, // Indigo background
  cafe: { iconName: "local_cafe", color: "#795548" }, // Brown background
  toilets: { iconName: "wc", color: "#9E9E9E" }, // Gray background
  doctor: { iconName: "medical_services", color: "#FF5722" }, // Orange background
  pharmacy: { iconName: "local_pharmacy", color: "#F44336" }, // Red background
  post_office: { iconName: "mail", color: "#FF9800" }, // Amber background
  police: { iconName: "local_police", color: "#2196F3" }, // Blue background
  fast_food: { iconName: "fastfood", color: "#FFC107" }, // Yellow background
  university: { iconName: "school", color: "#3F51B5" }, // Indigo background
  fuel: { iconName: "local_gas_station", color: "#607D8B" }, // Blue-gray background
  place_of_worship: { iconName: "place", color: "#9C27B0" }, // Purple background
  parking: { iconName: "local_parking", color: "#4CAF50" }, // Green background
  bus_station: { iconName: "directions_bus", color: "#4CAF50" }, // Green background
  courthouse: { iconName: "gavel", color: "#673AB7" }, // Purple background
  cinema: { iconName: "movie", color: "#FF9800" }, // Amber background
  theatre: { iconName: "theater_comedy", color: "#E91E63" }, // Pink background
  default: { iconName: "place", color: "#9E9E9E" }, // Gray background
};

// Generate icon mapping dynamically
export const iconMapping = Object.fromEntries(
  Object.entries(typeToIconMapping).map(([type, { iconName, color }]) => [
    type,
    generateIcon(iconName, color, "white"),
  ]),
);
