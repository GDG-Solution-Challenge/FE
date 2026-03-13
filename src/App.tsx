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
          // 토큰은 있지만 아이가 없으면 언어 설정부터 다시
          navigate('/onboarding', { replace: true, state: { step: 'language' } });
        }
      })
      .catch(() => {
        // 401 등 인증 실패 시 토큰 초기화 후 로그인
        authStore.clear();
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
