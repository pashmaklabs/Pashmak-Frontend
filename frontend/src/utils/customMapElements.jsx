import maplibregl from "maplibre-gl";

// Default circle marker (Routing Start)
export const createCircleMarker = (color = "#0074D9", size = "20px") => {
  const el = document.createElement("div");
  el.style.width = size;
  el.style.height = size;
  el.style.border = `5px solid ${color}`;
  el.style.borderRadius = "50%";
  el.style.backgroundColor = "white";
  el.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";
  el.style.cursor = "pointer";
  return el;
};

// Red pin marker (Routing End marker, Place marker)
export const createRedPinMarker = () => {
  const el = document.createElement("img");
  el.src = "/locPin.svg";
  el.style.width = "50px";
  el.style.height = "50px";
  el.style.marginTop = "-25px";
  el.style.cursor = "pointer";
  return el;
};

// Default marker (search results)
export const createDefaultMarker = () => {
  return null;
};

// User location marker
export const createUserLocationMarker = () => {
  const el = document.createElement("div");
  el.className = "fixed-circle";
  el.innerHTML = `
      <div class="relative w-5 h-5 bg-blue-500 border-[1.5px] border-white rounded-full opacity-100 shadow-[0_0_10px_rgba(66,133,244,0.5)]"></div>
      <div class="absolute top-[-7px] left-[-7px] w-[34px] h-[34px] bg-blue-500/20 rounded-full"></div>
    `;
  return el;
};

// Add marker to the map
export const addMarkerToMap = (map, lngLat, element) => {
  return new maplibregl.Marker({ element }).setLngLat(lngLat).addTo(map);
};

// pop up (routing)
export const createPopup = (map, lngLat, duration, distance) => {
  const injectPopupStyles = () => {
    if (document.getElementById("popup-styles")) return;

    const style = document.createElement("style");
    style.id = "popup-styles";
    style.innerHTML = `
      .xyz-dialog {
        font-family: sans-serif;
        background-color: rgba(59, 130, 246, 0.9); /* Blue background with transparency */
        color: white; /* White text */
        font-size: 12px; /* Smaller font size */
        padding: 4px; /* Add padding */
        border-radius: 8px; /* Rounded corners */
        text-align: center; /* Center align text */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
        position: relative; /* For the triangle positioning */
        width: 80px; /* Fixed width */
      }

      .xyz-dialog::after {
        content: "";
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgba(59, 130, 246, 0.9);
        position: absolute;
        top: 100%;
        left: 40%;
      }

      .maplibregl-popup {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }

      .maplibregl-popup-tip {
        display: none !important;
      }

      .maplibregl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .maplibregl-popup-content-tip {
        display: none !important;
      }

      .maplibregl-popup-close-button {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };
  injectPopupStyles();

  const popup = new maplibregl.Popup({ closeOnClick: false, offset: 12 })
    .setLngLat(lngLat)
    .setHTML(
      `
      <div class="xyz-dialog" dir="rtl">
        <div> ${(duration / 60).toFixed(1)} دقیقه</div>
        <div> ${(distance / 1000).toFixed(1)} کیلومتر</div>
      </div>
    `,
    )
    .addTo(map);

  return popup;
};
