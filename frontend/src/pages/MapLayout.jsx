import { Outlet, useLocation } from "react-router-dom";
import Map from "./Map";
import SearchLocation from "./SearchLocation";
import PlaceDetail from "./PlaceDetail";
import Login from "./Login";
import ChangePassword from "./ChangePassword";
import routes from "../routes/Routes";
import BookmakrsContainer from "../components/BookmarksContainer";
import { useState, useEffect, useRef } from "react";
import Routing from "./Routing";
import SearchHistory from "./SearchHistory";
import Profile from "./Profile";

const MainLayout = () => {
  const location = useLocation();
  const prevPath = useRef(null);
  const [effectivePath, setEffectivePath] = useState(location.pathname);
  const search = effectivePath.includes(routes.search);
  const place = effectivePath.includes(routes.place);
  const login = location.pathname.includes(routes.login);
  const changePassword = location.pathname.includes(routes.changePassword);

  const bookmarks = location.pathname.includes(routes.bookmarks);
  const [expendBookmarksList, setexpendBookmarksList] = useState(true);
  const [bookmarkedLocationsPoints, setBookmarksLocationsPoints] =
    useState(null);

  const profile = location.pathname.includes(routes.profile);
  const [expendSearch, setExpendSearch] = useState(false);
  const [hasSearch, setHasSearch] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const history = location.pathname.includes(routes.searchHistory);
  const [searchWithHistory, setSearchWithHistory] = useState({
    isSearching: false, // boolean
    query: "", // string
  });

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
        setExpendSearch={setExpendSearch}
        setSearchResult={setSearchResult}
        bookmarkedLocationsPoints={bookmarkedLocationsPoints}
        searchWithHistory={searchWithHistory}
        setSearchWithHistory={setSearchWithHistory}
      />
      {login && <Login />}
      {(profile||changePassword) && <Profile />}

      {/* {changePassword && <ChangePassword />} */}

      {((place && expendSearch) || search) && (searchResult && searchResult.length > 0) && !resetSearch && (
        <SearchLocation
          setResetSearch={setResetSearch}
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
          searchResult={searchResult}
        />
      )}
        {bookmarks && (
        <BookmakrsContainer
          expendBookmarksList={expendBookmarksList}
          setexpendBookmarksList={setexpendBookmarksList}
          setBookmarksLocationsPoints={setBookmarksLocationsPoints}
          />
      )}
      {place && (
        <PlaceDetail
          expendSearch={expendSearch&&!resetSearch}
          searchClosed={resetSearch}
          setExpendSearch={setExpendSearch}
          hasSearch={hasSearch}
        />
      )}

      {dir && <Routing />}

      {history && (
        <SearchHistory
          searchWithHistory={searchWithHistory}
          setSearchWithHistory={setSearchWithHistory}
        />
      )}

      <Outlet />
    </>
  );
};

export default MainLayout;
