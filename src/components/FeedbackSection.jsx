import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, Divider, CircularProgress, Fade, Grow, Skeleton, LinearProgress, Collapse } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FeedbackLoadingAnimation = () => (
  <>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      mb: 3
    }}>
      <CircularProgress 
        size={40} 
        thickness={4} 
        sx={{ mb: 2 }}
      />
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#1976d2',
          fontWeight: 500,
          mb: 1,
          direction: 'rtl'
        }}
      >
        בודק את התשובה שלך...
      </Typography>
      <Box 
        sx={{ 
          width: '100%', 
          mt: 2,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Grow in={true} timeout={800}>
          <Box sx={{ 
            width: '60%', 
            height: 4, 
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '30%',
              height: '100%',
              backgroundColor: '#1976d2',
              animation: 'loading 1.5s infinite',
              borderRadius: 2,
            },
            '@keyframes loading': {
              '0%': {
                left: '-30%',
              },
              '100%': {
                left: '100%',
              },
            },
          }} />
        </Grow>
      </Box>
    </Box>
  </>
);

function FeedbackSection({ feedback, question, isProcessing, onNextQuestion, onRetry }) {
  const [showSolution, setShowSolution] = useState(false);

  // Add MathJax typesetting after content updates
  useEffect(() => {
    const processMathJax = async () => {
      if (window.MathJax && feedback) {
        try {
          // Clear previous equations
          window.MathJax.typesetClear();
          
          // Wait for DOM to update
          await new Promise(resolve => setTimeout(resolve, 0));
          
          // Process new equations
          await window.MathJax.typesetPromise();
        } catch (err) {
          console.error('MathJax processing error:', err);
        }
      }
    };

    processMathJax();
  }, [feedback]);

  const renderMathText = (text) => {
    if (!text) return null;
    
    // Split by \n and process each line separately
    const lines = text.split('\\n');
    
    return (
      <Box 
        component="div" 
        sx={{ 
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 1.8,
          '& .MathJax': {
            fontSize: '110%',
            margin: '0 4px',
            display: 'inline-block',
            verticalAlign: 'middle',
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            '& mjx-container': {
              minWidth: '0 !important',
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'break-word'
            }
          }
        }}
      >
        {lines.map((line, index) => {
          const formattedLine = line
            .replace(/([^\\])\\\(/g, '$1 \\(')
            .replace(/\\\)([^,\.\s])/g, '\\) $1')
            .replace(/\s*([,\.])\s*/g, '$1 ')
            .replace(/\s+/g, ' ')
            .trim();

          return (
            <Typography 
              key={index} 
              className="tex2jax_process" 
              component="div"
              sx={{
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                mb: index < lines.length - 1 ? 1 : 0
              }}
            >
              {formattedLine}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const SectionTitle = ({ title }) => (
    <Typography variant="subtitle1" sx={{ 
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'right',
      mb: 1,
      width: '100%'
    }}>
      {title}
    </Typography>
  );

  const getAssessmentText = (percentage) => {
    if (percentage === 100) return 'מצוין!';
    if (percentage >= 90) return 'כמעט מושלם!';
    if (percentage >= 80) return 'טוב מאוד!';
    if (percentage >= 70) return 'טוב!';
    if (percentage >= 55) return 'עבר';
    return 'נכשל';
  };

  const getAssessmentColor = (percentage) => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 55) return 'warning.main';
    return 'error.main';
  };

  // Return null if we're not processing and have no feedback
  if (!isProcessing && !feedback) return null;

  // Special rendering for multiple choice questions
  if (question?.question.type === 'multiple_choice') {
    const isCorrect = feedback.assessment.correctness_percentage === 100;

    return (
      <Fade in={true}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)',
            direction: 'rtl'
          }}
        >
          {isProcessing ? (
            <FeedbackLoadingAnimation />
          ) : (
            <>
              {/* Assessment Result */}
              <Box sx={{ 
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                {isCorrect ? (
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40 }} />
                ) : (
                  <ErrorIcon sx={{ color: 'error.main', fontSize: 40 }} />
                )}
                <Typography variant="h5" sx={{ color: isCorrect ? 'success.main' : 'error.main' }}>
                  {isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה'}
                </Typography>
              </Box>

              {/* Solution */}
              <Box sx={{ 
                mb: 4,
                backgroundColor: '#f5f7fa',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 3
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
                  התשובה הנכונה: {renderMathText(question.solution.final_answer)}
                </Typography>
                <Typography sx={{ color: '#2c3e50' }}>
                  {renderMathText(question.solution.explanation)}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 3 
              }}>
                <Button
                  variant="outlined"
                  sx={{ 
                    minWidth: 120,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                  onClick={onRetry}
                >
                  נסה שוב
                  <ReplayIcon />
                </Button>
                <Button
                  variant="contained"
                  sx={{ 
                    minWidth: 120,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                  onClick={onNextQuestion}
                >
                  שאלה הבאה
                  <ArrowBackIcon />
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Fade>
    );
  }

  // Original feedback rendering for other question types
  return (
    <Fade in={true}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)',
          direction: 'rtl'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              color: '#2c3e50',
              flexGrow: 1,
              textAlign: 'right'
            }}
          >
            משוב
          </Typography>
        </Box>

        {isProcessing ? (
          <FeedbackLoadingAnimation />
        ) : (
          <>
            {/* Assessment Score */}
            <Box sx={{ 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
              <Box sx={{ 
                width: '4px',
                height: '40px',
                backgroundColor: getAssessmentColor(feedback.assessment.correctness_percentage),
                borderRadius: '2px'
              }} />
              
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: getAssessmentColor(feedback.assessment.correctness_percentage),
                    fontWeight: 'bold'
                  }}
                >
                  {feedback.assessment.correctness_percentage}%
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: getAssessmentColor(feedback.assessment.correctness_percentage),
                    fontWeight: 'bold'
                  }}
                >
                  {getAssessmentText(feedback.assessment.correctness_percentage)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Analysis Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                נכון
              </Typography>
              <Typography component="div" sx={{ color: '#2c3e50', lineHeight: 1.8, mb: 3 }}>
                {renderMathText(feedback.analysis.correct_parts)}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                שגוי
              </Typography>
              <Typography component="div" sx={{ color: '#2c3e50', lineHeight: 1.8, mb: 3 }}>
                {renderMathText(feedback.analysis.mistakes)}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                שיפור
              </Typography>
              <Typography component="div" sx={{ color: '#2c3e50', lineHeight: 1.8 }}>
                {renderMathText(feedback.analysis.guidance)}
              </Typography>
            </Box>

            {/* Solution Toggle Button */}
            {question?.solution && (
              <>
                <Divider sx={{ mb: 2 }} />
                
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  endIcon={showSolution ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  sx={{ 
                    width: '100%',
                    justifyContent: 'space-between',
                    color: '#1976d2',
                    mb: 2,
                    border: '1px solid #1976d2',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      borderColor: '#1565c0'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    הצג פתרון מלא
                  </Typography>
                </Button>

                <Collapse in={showSolution}>
                  <Box sx={{ 
                    mb: 4,
                    backgroundColor: '#f5f7fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    {/* Solution Section */}
                    <Box sx={{ mb: 4 }}>
                      {question.solution.explanation && (
                        <Typography 
                          sx={{ 
                            color: '#2c3e50', 
                            mb: 2
                          }}
                        >
                          {renderMathText(question.solution.explanation)}
                        </Typography>
                      )}
                      {question.solution.steps?.map((step, index) => (
                        <Typography 
                          key={index} 
                          sx={{ 
                            mb: 2,
                            color: '#2c3e50',
                            pl: 2,
                            borderRight: '3px solid #e0e0e0',
                            pr: 2,
                            py: 1
                          }}
                        >
                          {renderMathText(step.explanation)}
                        </Typography>
                      ))}
                    </Box>

                    <Divider sx={{ mb: 4, borderColor: '#e0e0e0' }} />

                    {/* Final Answer Section */}
                    {question.solution.final_answer && (
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold', 
                            mb: 2, 
                            color: '#2c3e50',
                            borderBottom: '2px solid #e0e0e0',
                            pb: 1
                          }}
                        >
                          תשובה סופית
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: '#2c3e50',
                            fontWeight: 'medium',
                            p: 2
                          }}
                        >
                          {renderMathText(question.solution.final_answer)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </>
            )}

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 3 
            }}>
              <Button
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                onClick={onRetry}
              >
                נסה שוב
                <ReplayIcon />
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  minWidth: 120,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                onClick={onNextQuestion}
              >
                שאלה הבאה
                <ArrowBackIcon />
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Fade>
  );
}

export default FeedbackSection; 