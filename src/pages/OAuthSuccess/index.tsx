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
        const firstChild = chatData.result?.childChatGroups?.[0];

        if (firstChild) {
          navigate(`/child/${firstChild.childId}`, { replace: true });
        } else {
          // koreanLevel은 있지만 아이가 없으면 아이 등록 단계로
          navigate('/onboarding', { replace: true, state: { step: 'children' } });
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
