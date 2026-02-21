import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// TODO: 실제 자녀 데이터로 교체
const mockChildren = [
  { id: '1', name: '김민준', age: '5살', gender: '남아' },
  { id: '2', name: '김서아', age: '3살', gender: '여아' },
];

const ChildSelect = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: 6, px: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        어떤 아이의 노트를
      </Typography>
      <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 1 }}>
        확인할까요?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        자녀를 선택하면 해당 아이의 채팅 화면으로 이동합니다
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {mockChildren.map((child) => (
          <ButtonBase
            key={child.id}
            onClick={() => navigate(`/child/${child.id}`)}
            sx={{
              width: '100%',
              borderRadius: 3,
              textAlign: 'left',
              border: '1px solid #F0F0F0',
              overflow: 'hidden',
              '&:hover': { backgroundColor: '#FAFAFA' },
              '&:active': { backgroundColor: '#F0F7EE' },
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2.5,
                py: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: child.gender === '남아' ? '#E3F2FD' : '#FCE4EC',
                  flexShrink: 0,
                }}
              >
                <ChildCareIcon
                  sx={{ color: child.gender === '남아' ? '#1976D2' : '#E91E63', fontSize: 24 }}
                />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  {child.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {child.age} · {child.gender}
                </Typography>
              </Box>

              <ChevronRightIcon sx={{ color: '#BDBDBD', fontSize: 20 }} />
            </Box>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
};

export default ChildSelect;
