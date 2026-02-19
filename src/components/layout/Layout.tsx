import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../common/Sidebar";

const Layout = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#fff' }}>
      <Sidebar />
      <Box component="main" sx={{ width: '100%', height: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
