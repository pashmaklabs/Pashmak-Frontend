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
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    if (search) {
      setHasdSearch(true);
    }
  }, [search]);
  return (
    <div>
      <Map
        expendSearch={expendSearch}
        setExpendSearch={setExpendSearch}
        setSearchResult={setSearchResult}
      />
      {((place && expendSearch) || search) && searchResult && (
        <SearchLocation
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
          searchResult={searchResult}
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
