export const fetchPoints = async (bounds) => {
  const { _ne, _sw } = bounds;
  const bbox = `${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng}`;
  const query = `
    [out:json];
    (
      node["amenity"](bbox);
    );
    out body;`.replace("bbox", bbox);

  const url = "https://overpass-api.de/api/interpreter";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  const data = await response.json();
  const features = data.elements
    .filter((item) => item.lat && item.lon)
    .filter((item) => item.tags?.name && item.tags.name !== "Unnamed Location") 
    .map((item) => {
      const type = item.tags?.amenity || item.tags?.shop || "default";
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.lon, item.lat],
        },
        properties: {
          id: item.id,
          name: item.tags?.name || "Unnamed Location",
          type,
          icon: "cat",
        },
      };
    });
  return {
    type: "FeatureCollection",
    features,
  };
};
