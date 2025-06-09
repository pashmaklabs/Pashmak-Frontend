import { Outlet, useLocation } from "react-router-dom";
import Map from "./Map";
import SearchLocation from "./SearchLocation";
import PlaceDetail from "./PlaceDetail";
import Login from "./Login";
import ChangePassword from "./ChangePassword";
import routes from "../routes/Routes";
import { useState, useEffect, useRef } from "react";
import Routing from "./Routing"; 

const MainLayout = () => {
  const location = useLocation();
  const prevPath = useRef(null);
  const [effectivePath, setEffectivePath] = useState(location.pathname);
  const search = effectivePath.includes(routes.search);
  const place = effectivePath.includes(routes.place);
  const login = location.pathname.includes(routes.login);
  const changePassword = location.pathname.includes(routes.changePassword);
  const [expendSearch, setExpendSearch] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

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


  const dir = effectivePath.includes(routes.dir); 

  
  useEffect(() => {
    if (search) {
      setHasSearch(true);
    }
  }, [search]);


  return (
    <>
      <Map
        resetSearch={resetSearch}
        setResetSearch={setResetSearch}
        expendSearch={expendSearch}
        setSearchResult={setSearchResult}
      />
      {login && <Login />}

      {changePassword && <ChangePassword />}

      {((place && expendSearch) || search) && searchResult && (
        <SearchLocation
          setResetSearch={setResetSearch}
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

      {dir && <Routing />}
      
      <Outlet />
    </>
  );
};

export default MainLayout;
