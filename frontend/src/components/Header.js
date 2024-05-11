import React, { useContext, useEffect } from "react";
import { Context } from "../index";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  INTO_CHAT_ROUTE,
  BASKET_ROUTE,
  MAIN_ROUTE,
} from "../utils/consts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Phone from "@mui/icons-material/Phone";
import Cart from "@mui/icons-material/ShoppingCart";
import Shop from "@mui/icons-material/Storefront";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Divider } from "@mui/material";
import { fetchBasketDevicesByUser } from "../http/deviceAPI";

const Header = observer(() => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { user, basketDevice } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth && user.user.role !== "ADMIN") {
      fetchBasketDevicesByUser(
        basketDevice.page,
        basketDevice.limit,
        user.user.id
      ).then((data) => {
        basketDevice.setBasketDevices(data.rows);
        basketDevice.setTotalCount(data.count);
      });
    }
  }, []);
  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");

    navigate(MAIN_ROUTE);
  };

  useEffect(() => {}, [basketDevice.totalCount]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user.isAuth ? (
        user.user.role !== "ADMIN" ? (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              logOut();
            }}
          >
            Выйти
          </MenuItem>
        ) : (
          <Box>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(ADMIN_ROUTE);
              }}
            >
              Администрирование
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logOut();
              }}
            >
              Выйти
            </MenuItem>
          </Box>
        )
      ) : (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(LOGIN_ROUTE);
          }}
        >
          Вход
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      className=""
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate(SHOP_ROUTE)} className=" ps-2">
        <IconButton size="large" aria-label="Магазин" color="inherit">
          <Shop />
        </IconButton>
        <p className="m-0">Магазин</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen} className=" ps-2">
        <IconButton
          size="large"
          aria-label="Профиль"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p className="m-0">Профиль</p>
      </MenuItem>

      {user.isAuth &&
        user.user.role !== "ADMIN" && [
          <MenuItem onClick={() => navigate(BASKET_ROUTE)} className=" ps-2">
            <IconButton size="large" aria-label="Козина" color="inherit">
              <Badge badgeContent={basketDevice.totalCount} color="error">
                <Cart />
              </Badge>
            </IconButton>
            <p className="m-0">Корзина</p>
          </MenuItem>,

          <MenuItem className=" ps-2" onClick={() => navigate(INTO_CHAT_ROUTE)}>
            <IconButton size="large" aria-label="Техподдержка" color="inherit">
              <Phone />
            </IconButton>
            <p className="m-0">Техподдержка</p>
          </MenuItem>,
        ]}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="transparent"
        className="glass-light border-bottom border-1 border-light shadow-0 rounded-0"
      >
        <Toolbar>
          <Box sx={{ flexGrow: 0.1 }} />

          <Divider
            orientation="vertical"
            className="h-100 mx-2 bg-white"
            style={{ minHeight: "50px" }}
          />

          <svg
            id="svg"
            style={{
              cursor: "pointer",
              marginTop: "-10px",
              marginBottom: "10px",
            }}
            onClick={() => {
              navigate(MAIN_ROUTE);
            }}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="150"
            height="80"
            viewBox="0 0 300 440"
          >
            <g id="svgg">
              <path
                d="M-42.4,292.8c0,14.5-14.9,25.6-41.9,25.6c-19.2,0-36.3-6-47-17.5l4.3-4.3c10.2,11.1,25.2,16.2,42.7,16.2
            c22.6,0,35.4-8.1,35.4-19.2c0-11.5-13.7-14.5-37.6-16.7c-21.4-2.1-42.3-6.4-42.3-22.2c0-14.9,19.6-23.5,41-23.5
            c17.9,0,32,6,40.6,14.5l-4.7,3.8c-8.1-9-20.9-12.8-35.4-12.8c-15.8,0-35,5.6-35,17.5c0,11.5,17.1,14.5,38,16.2
            C-59.5,272.8-42.4,277.5-42.4,292.8z M0.3,315.9v-82.4h6v82.4H0.3z M146.8,294.1c-6,14.1-22.6,24.3-45.7,24.3
            c-31.6,0-49.5-17.1-49.5-43.6s18.4-43.6,49.5-43.6c19.6,0,33.3,7.3,41.4,17.5l-5.1,3.8c-7.7-10.2-19.6-15.4-36.3-15.4
            c-26.5,0-43.1,13.2-43.1,38c0,24.3,17.1,38,43.6,38c18.4,0,33.3-6.4,39.7-20.1v-12.4h-40.6v-5.6h46.5v18.8H146.8z M413.7,291.6
            h-58.5l-13.7,24.3h-6.8l46.1-82.4h6.8l46.1,82.4h-6.8L413.7,291.6z M410.7,286l-26-47l-26,47H410.7z M294.9,315.9h-24.3l6-5.1h13.2
            v-51.2l-48.7,40.1L204,268.9v-6.8l37.2,30.7l53.8-44.4V315.9z M211.7,315.9h-23.5v-82l53,43.6l53.8-44.4v6.8l-53.8,44.4l-47.4-39.7
            v66.2h12L211.7,315.9z M468.8,248.4c0,9.4-6.8,15.8-16.7,15.8c-9.8,0-16.7-6.4-16.7-15.8c0-9.4,6.8-15.8,16.7-15.8
            C461.9,232.6,468.8,239,468.8,248.4z M467,248.4c0-8.5-6-14.1-14.9-14.1c-9.4,0-14.9,5.6-14.9,14.1s6,14.1,14.9,14.1
            C461.5,262.5,467,257,467,248.4z M455.5,250.1l6,6.4h-2.1l-5.6-6.4h-7.3v6.4h-1.7v-16.2h10.2c3.8,0,6,2.1,6,5.1
            C461.1,248,458.9,249.7,455.5,250.1z M454.2,248.9c3,0,4.7-1.3,4.7-3.4c0-2.6-1.7-3.4-4.7-3.4h-8.1v6.8H454.2z"
              />
            </g>
          </svg>

          <Divider
            orientation="vertical"
            className="h-100 mx-2 bg-white"
            style={{ minHeight: "50px" }}
          />

          <Box sx={{ flexGrow: 1 }} />
          <Divider
            orientation="vertical"
            className="h-100 mx-2 bg-white"
            style={{ minHeight: "50px" }}
          />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="Техподдержка"
              onClick={() => navigate(SHOP_ROUTE)}
              color="inherit"
            >
              <Shop />
            </IconButton>
            {user.isAuth &&
              user.user.role !== "ADMIN" && [
                <IconButton
                  size="large"
                  aria-label="Техподдержка"
                  onClick={() => navigate(INTO_CHAT_ROUTE)}
                  color="inherit"
                >
                  <Phone />
                </IconButton>,
                <IconButton
                  size="large"
                  aria-label="Корзина"
                  color="inherit"
                  onClick={() => navigate(BASKET_ROUTE)}
                >
                  <Badge badgeContent={basketDevice.totalCount} color="error">
                    <Cart />
                  </Badge>
                </IconButton>,
              ]}

            <IconButton
              size="large"
              edge="end"
              aria-label="Профиль"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
});

export default Header;
