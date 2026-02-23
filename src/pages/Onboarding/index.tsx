import { useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import GoogleLogin from './GoogleLogin';
import LanguageSetup from './LanguageSetup';
import ChildrenSetup from './ChildrenSetup';

const STEPS = ['login', 'language', 'children'] as const;

const Onboarding = () => {
  const [step, setStep] = useState<(typeof STEPS)[number]>('login');

  const progress = ((STEPS.indexOf(step) + 1) / STEPS.length) * 100;

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
        {step === 'login' && <GoogleLogin onNext={() => setStep('language')} />}
        {step === 'language' && <LanguageSetup onNext={() => setStep('children')} />}
        {step === 'children' && <ChildrenSetup onNext={() => {/* TODO: navigate to main */}} />}
      </Box>
    </Box>
  );
};

export default Onboarding;
