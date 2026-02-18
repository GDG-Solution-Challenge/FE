import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
