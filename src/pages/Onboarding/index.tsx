import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import GoogleLogin from './GoogleLogin';
import LanguageSetup from './LanguageSetup';
import ChildrenSetup from './ChildrenSetup';

const STEPS = ['login', 'language', 'children'] as const;
type Step = (typeof STEPS)[number];

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialStep = (STEPS as readonly string[]).includes((location.state as { step?: string })?.step ?? '')
    ? ((location.state as { step: Step }).step)
    : 'login';
  const [step, setStep] = useState<Step>(initialStep);

  const progress = (STEPS.indexOf(step) / STEPS.length) * 100;

  return (
    <Box sx={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      {step !== 'login' && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 3, backgroundColor: '#E8E8E8', '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' } }}
        />
      )}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {step === 'login' && <GoogleLogin />}
        {step === 'language' && <LanguageSetup onNext={() => setStep('children')} />}
        {step === 'children' && <ChildrenSetup onNext={(kidId) => navigate(kidId ? `/child/${kidId}` : '/', { replace: true })} />}
      </Box>
    </Box>
  );
};

export default Onboarding;
