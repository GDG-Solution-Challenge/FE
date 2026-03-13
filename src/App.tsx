import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Layout from "./components/layout/Layout";
import Onboarding from "./pages/Onboarding";
import OAuthSuccess from "./pages/OAuthSuccess";
import Main from "./pages/Main";
import Records from "./pages/Records";
import Settings from "./pages/Settings";
import { authStore } from "./store/auth";
import { getChatRooms } from "./api/chat";

const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = authStore.getToken();
    const userId = authStore.getUserId();

    if (!token || !userId) {
      navigate('/onboarding', { replace: true });
      return;
    }

    getChatRooms(userId)
      .then((data) => {
        const firstChild = data.result?.childChatGroups?.[0];
        if (firstChild) {
          navigate(`/child/${firstChild.childId}`, {
            replace: true,
            state: { childName: firstChild.childName },
          });
        } else {
          navigate('/onboarding', { replace: true });
        }
      })
      .catch(() => {
        navigate('/onboarding', { replace: true });
      });
  }, []);

  return (
    <Box sx={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route element={<Layout />}>
          <Route path="/child/:childId" element={<Main />} />
          <Route path="/records/:childId" element={<Records />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
