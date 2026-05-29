import { Helmet } from "react-helmet";

const LocationSuggestions = () => {
  return (
    <div className="p-4">
      <Helmet>
        <title>پیشنهادهای مکان</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-4 text-black">
        پیشنهادهای اضافه شدن مکان‌ها
      </h1>
    </div>
  );
};

export default LocationSuggestions;
