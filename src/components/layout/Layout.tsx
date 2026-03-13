import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../common/Sidebar";
import bottomPng from "../../assets/bottom.png";

const Layout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/child/');

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#fff', overflow: 'hidden' }}>
      <Sidebar />
      <Box component="main" sx={{ width: '100%', height: '100%' }}>
        <Outlet />
      </Box>
      {isChatPage && (
        <Box
          component="img"
          src={bottomPng}
          alt=""
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
    </Box>
  );
};

export default Layout;
