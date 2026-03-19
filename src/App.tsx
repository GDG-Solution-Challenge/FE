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
import { getUser } from "./api/user";

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
          // chatRooms 없으면 localKids 확인
          const localKids = authStore.getLocalKids();
          if (localKids.length > 0) {
            navigate(`/child/${localKids[0].kidId}`, {
              replace: true,
              state: { childName: localKids[0].name },
            });
          } else {
            // localKids도 없으면 getUser로 온보딩 단계 판단
            getUser(userId)
              .then((user) => {
                if (!user.koreanLevel) {
                  navigate('/onboarding', { replace: true, state: { step: 'language' } });
                } else {
                  navigate('/onboarding', { replace: true, state: { step: 'children' } });
                }
              })
              .catch(() => {
                navigate('/onboarding', { replace: true, state: { step: 'language' } });
              });
          }
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          // 인증 만료: 토큰 초기화 후 로그인
          authStore.clear();
          navigate('/onboarding', { replace: true });
        } else {
          // 네트워크/서버 오류: 토큰 유지, localKids로 복구
          const localKids = authStore.getLocalKids();
          if (localKids.length > 0) {
            navigate(`/child/${localKids[0].kidId}`, {
              replace: true,
              state: { childName: localKids[0].name },
            });
          } else {
            navigate('/onboarding', { replace: true, state: { step: 'language' } });
          }
        }
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
