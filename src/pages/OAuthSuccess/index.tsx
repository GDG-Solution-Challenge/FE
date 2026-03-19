import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { authStore } from '../../store/auth';
import { getUser } from '../../api/user';
import { getChatRooms } from '../../api/chat';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/onboarding', { replace: true });
      return;
    }

    authStore.setToken(token);
    const userId = authStore.getUserId();

    if (!userId) {
      navigate('/onboarding', { replace: true });
      return;
    }

    const checkSetup = async () => {
      try {
        const user = await getUser(userId);

        if (!user.koreanLevel) {
          navigate('/onboarding', { replace: true, state: { step: 'language' } });
          return;
        }

        const chatData = await getChatRooms(userId);
        const childGroups = chatData.result?.childChatGroups ?? [];

        // 서버 kids → localKids 동기화 (로그아웃 후 재로그인에도 복구)
        childGroups.forEach((g) => authStore.addLocalKid({ kidId: g.childId, name: g.childName }));

        const firstChild = childGroups[0];
        if (firstChild) {
          navigate(`/child/${firstChild.childId}`, { replace: true, state: { childName: firstChild.childName } });
        } else {
          const localKids = authStore.getLocalKids();
          if (localKids.length > 0) {
            navigate(`/child/${localKids[0].kidId}`, {
              replace: true,
              state: { childName: localKids[0].name },
            });
          } else {
            navigate('/onboarding', { replace: true, state: { step: 'children' } });
          }
        }
      } catch {
        navigate('/onboarding', { replace: true, state: { step: 'language' } });
      }
    };

    checkSetup();
  }, []);

  return (
    <Box sx={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

export default OAuthSuccess;
