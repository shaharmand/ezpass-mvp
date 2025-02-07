import React, { useState, useRef } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import TopPanel from './components/TopPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import '@fontsource/rubik';
import { Analytics } from "@vercel/analytics/react"
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        inputProps: {
          dir: 'rtl',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            right: 16,
            left: 'auto',
          },
          '& .MuiOutlinedInput-root': {
            textAlign: 'right',
          }
        }
      }
    }
  }
});

function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [progress, setProgress] = useState({
    completed: 0,
    successRate: 0,
  });

  const questionDisplayRef = useRef(null);

  const handleQuestionGenerated = (question) => {
    console.log('Question generated:', question);
  };

  const handleSkipQuestion = () => {
    console.log('Question skipped');
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            py: 4
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100vh',
              width: '100%',
              overflow: 'hidden'
            }}>
              <TopPanel
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedExam={selectedExam}
                setSelectedExam={setSelectedExam}
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                selectedSubtopic={selectedSubtopic}
                setSelectedSubtopic={setSelectedSubtopic}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                selectedSubtopics={selectedSubtopics}
                setSelectedSubtopics={setSelectedSubtopics}
                progress={progress}
              />
              
              <Box sx={{ 
                display: 'flex', 
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                overflow: 'hidden',
                gap: 2,
                px: 2,
                pt: 2
              }}>
                <Box sx={{ 
                  flex: '0 1 65%',
                  maxWidth: '1400px',
                  minWidth: 0,
                  display: 'flex'
                }}>
                  <CenterPanel
                    ref={questionDisplayRef}
                    setProgress={setProgress}
                    selectedSubject={selectedSubject}
                    selectedExam={selectedExam}
                    selectedTopic={selectedTopic}
                    selectedSubtopic={selectedSubtopic}
                    selectedTopics={selectedTopics}
                    selectedSubtopics={selectedSubtopics}
                    onQuestionGenerated={handleQuestionGenerated}
                    onSkipQuestion={handleSkipQuestion}
                  />
                </Box>

                <Box sx={{ 
                  flex: '1 1 35%',
                  minWidth: 0,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <RightPanel />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
        <Analytics />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App; 