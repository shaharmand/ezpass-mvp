import React, { useState, useRef, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, Paper } from '@mui/material';
import TopPanel from './components/TopPanel';
import CenterPanel from './components/CenterPanel';
import Assistance from './components/Assistance';
import LearningContent from './components/LearningContent';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import '@fontsource/rubik';
import { Analytics } from "@vercel/analytics/react"
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MantineProvider } from '@mantine/core';
import ProgressDialog from './components/ProgressDialog';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            left: 14,
            right: 'auto',
            transformOrigin: 'top left',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(0, -9px) scale(0.75)'
            }
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              textAlign: 'left'
            },
            '& legend': {
              marginLeft: 0,
              marginRight: 'auto',
              textAlign: 'left'
            },
            '& input': {
              textAlign: 'left'
            }
          },
          '& .MuiSelect-select': {
            paddingLeft: '14px !important',
            textAlign: 'left',
            width: '100%'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          textAlign: 'left'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          textAlign: 'left'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          textAlign: 'left'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          textAlign: 'left'
        },
        title: {
          textAlign: 'left'
        },
        subheader: {
          textAlign: 'left'
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        align: 'left'
      },
      styleOverrides: {
        root: {
          textAlign: 'right'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            textAlign: 'right'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          textAlign: 'right'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginLeft: 'auto',
          marginRight: 0
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          transform: 'scale(-1, 1)',
        },
      }
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '&.progress-container': {
            textAlign: 'right',
            '& .MuiTypography-root': {
              textAlign: 'right'
            }
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          textAlign: 'right'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          direction: 'rtl',
          '& .MuiDialogTitle-root': {
            direction: 'rtl',
            textAlign: 'right'
          },
          '& .MuiDialogContent-root': {
            direction: 'rtl',
            textAlign: 'right'
          },
          '& .MuiBox-root': {
            direction: 'rtl',
            textAlign: 'right'
          },
          '& .MuiTypography-root': {
            direction: 'rtl',
            textAlign: 'right'
          },
          '& .MuiLinearProgress-root': {
            transform: 'scaleX(-1)',
            '& .MuiLinearProgress-bar': {
              transform: 'scaleX(-1)'
            }
          }
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          textAlign: 'right'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          textAlign: 'right'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          textAlign: 'right',
          justifyContent: 'flex-end',
          '& .MuiListItemText-root': {
            textAlign: 'right'
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          direction: 'rtl'
        }
      }
    }
  }
});

// Create RTL theme for Mantine
const mantineTheme = {
  dir: 'rtl',
  fontFamily: 'Rubik, Arial, sans-serif',
  primaryColor: 'blue',
  components: {
    Modal: {
      styles: {
        root: { 
          direction: 'rtl'
        },
        header: { 
          direction: 'rtl',
          background: 'white',
          borderBottom: '1px solid #eee'
        },
        content: { 
          direction: 'rtl',
          background: 'white'
        },
        body: {
          background: 'white'
        },
        inner: {
          padding: '16px'
        }
      }
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: 'white'
        }
      }
    }
  }
};

// Add this component to handle resize observer
const ResizeObserverWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to let the DOM settle
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return children;
};

function App() {
  const [openDialog, setOpenDialog] = useState(false);
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
  const [chatMessages, setChatMessages] = useState([]);

  const questionDisplayRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleQuestionGenerated = (question) => {
    setCurrentQuestion(question);
    console.log('Question generated:', question);
  };

  const handleSkipQuestion = () => {
    console.log('Question skipped');
  };

  const handleNewMessage = (message) => {
    setChatMessages(prevMessages => [...prevMessages, message]);
  };

  const handleExamChange = (newExam) => {
    setSelectedExam(newExam);
    // Remove any automatic question generation
  };

  const handleGenerateQuestion = ({ resetState, newSelections }) => {
    if (resetState) {
      // Reset all states
      setCurrentQuestion(null);
      if (questionDisplayRef.current) {
        questionDisplayRef.current.resetStates();  // Add this method to CenterPanel
      }
    }
    
    // Then generate new question
    if (questionDisplayRef.current) {
      questionDisplayRef.current.generateQuestion(newSelections);
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <MantineProvider theme={mantineTheme}>
          <CssBaseline />
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
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
              onGenerateQuestion={handleGenerateQuestion}
              chatMessages={chatMessages}
              handleNewMessage={handleNewMessage}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              sx={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                bgcolor: '#ffffff'
              }}
            />
            
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '20% 60% 20%',
                gap: 0,
                height: '100%',
                overflow: 'hidden',
                p: 2
              }}>
                {/* Left Panel - Assistance */}
                <Box sx={{ 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Header */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      width: '100%'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'flex-end',  // Align to right
                        direction: 'rtl'
                      }}>
                        <SmartToyIcon sx={{ 
                          color: '#2c3e50',  // Match text color
                          fontSize: '1.5rem'  // Match text size
                        }} />
                        <div style={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: '1.25rem',
                          fontFamily: 'Rubik, Arial, sans-serif'
                        }}>
                          איזי
                        </div>
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Assistance 
                        messages={chatMessages} 
                        onSendMessage={handleNewMessage}
                        onOpenSettings={() => setOpenDialog(true)}
                        selectedExam={selectedExam}
                      />
                    </Box>
                  </Paper>
                </Box>

                {/* Center Panel - Simplified structure */}
                <Box sx={{ 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2
                }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      pt: 0,  // Remove any top padding
                      overflow: 'auto'  // Add this to enable scrolling
                    }}
                  >
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
                      onSendMessage={handleNewMessage}
                      onExamChange={() => setCurrentQuestion(null)}
                      sx={{ width: '100%' }}
                    />
                  </Paper>
                </Box>

                {/* Right Panel - Learning Content */}
                <Box sx={{ 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Header */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      width: '100%'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'flex-end',
                        direction: 'rtl'
                      }}>
                        <MenuBookIcon sx={{ 
                          color: '#2c3e50',
                          fontSize: '1.5rem'
                        }} />
                        <div style={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: '1.25rem',
                          fontFamily: 'Rubik, Arial, sans-serif'
                        }}>
                          חומר עזר
                        </div>
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <LearningContent 
                        currentQuestion={currentQuestion}
                        selectedSubject={selectedSubject}
                        selectedExam={selectedExam}
                        selectedTopic={selectedTopic}
                        selectedTopics={selectedTopics}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>
          <Analytics />
        </MantineProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App; 