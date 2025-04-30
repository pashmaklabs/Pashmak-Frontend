import { Outlet, useLocation } from "react-router-dom";
import Map from "./Map";
import SearchLocation from "./SearchLocation";
import PlaceDetail from "./PlaceDetail";
import routes from "../routes/Routes";
import { useState, useEffect } from "react";

const MainLayout = () => {
  const location = useLocation();
  const search = location.pathname.includes(routes.search);
  const place = location.pathname.includes(routes.place);

  const [expendSearch, setExpendSearch] = useState(false);
  const [hasSearch, setHasdSearch] = useState(false);
  useEffect(() => {
    if (search) {
      setHasdSearch(true);
    }
  }, [search]);
  return (
    <div>
      <Map />

      {((place && expendSearch) || search) && (
        <SearchLocation
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
        />
      )}

      {place && (
        <PlaceDetail
          expendSearch={expendSearch}
          setExpendSearch={setExpendSearch}
          hasSearch={hasSearch}
        />
      )}

      <Outlet />
    </div>
  );
};

export default MainLayout;
