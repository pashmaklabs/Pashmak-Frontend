import { Outlet, useLocation } from "react-router-dom";
import Map from "./Map";
import SearchLocation from "./SearchLocation";
import PlaceDetail from "./PlaceDetail";
import Login from "./Login";
import ChangePassword from "./ChangePassword";
import routes from "../routes/Routes";
import { useState, useEffect, useRef } from "react";

const MainLayout = () => {
  const location = useLocation();
  const prevPath = useRef(null);
  const [effectivePath, setEffectivePath] = useState(location.pathname);

  useEffect(() => {
    const isLogin = location.pathname.includes(routes.login);
    const isChangePassword = location.pathname.includes(routes.changePassword);

    if (!isLogin && !isChangePassword) {
      prevPath.current = location.pathname;
      setEffectivePath(location.pathname);
    } else if (prevPath.current) {
      setEffectivePath(prevPath.current);
    }
  }, [location.pathname]);

  const search = effectivePath.includes(routes.search);
  const place = effectivePath.includes(routes.place);
  const login = location.pathname.includes(routes.login);
  const changePassword = location.pathname.includes(routes.changePassword);

  const [expendSearch, setExpendSearch] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    if (search) {
      setHasSearch(true);
    }
  }, [search]);

  return (
    <div>
      <Map
        expendSearch={expendSearch}
        setExpendSearch={setExpendSearch}
        setSearchResult={setSearchResult}
      />
      {login && <Login />}

      {changePassword && <ChangePassword />}

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
