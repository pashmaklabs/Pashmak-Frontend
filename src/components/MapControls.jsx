import React from "react";

const MapControlsStyle = () => (
  <style>
    {`
      .maplibregl-ctrl-top-left {
        top: 50% !important;
        left: 10px !important;
        transform: translateY(-50%);
        z-index: 10;
      }
      .maplibregl-ctrl.maplibregl-ctrl-group {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        border: 1px solid #e5e7eb;
        overflow: hidden;
      }
      .maplibregl-ctrl-group button {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        color: #2563eb;
        font-size: 22px;
        transition: background 0.2s;
      }
      .maplibregl-ctrl-group button:hover {
        background: #f3f4f6;
        color: #1d4ed8;
      }
      .maplibregl-ctrl-group button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      .maplibregl-ctrl-bottom-right {
        right: 65px !important;
        bottom: -5px !important;
      }
      .custom-attribution {
        bottom: -10px !important; 
        left: -10px !important;   
}
    `}
  </style>
);

export default MapControlsStyle;
