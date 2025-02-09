import React, { useEffect, useState, useMemo } from 'react';
import { 
  Paper, 
  Box, 
  Button, 
  Divider, 
  CircularProgress, 
  Fade, 
  Typography,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import ReplayIcon from '@mui/icons-material/Replay';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const FeedbackLoadingAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    mb: 3
  }}>
    <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
    <Typography
      sx={{
        color: 'primary.main',
        fontWeight: 500,
        mb: 1,
        direction: 'rtl',
        fontFamily: 'Rubik, Arial, sans-serif'
      }}
    >
      בודק את התשובה שלך...
    </Typography>
  </Box>
);

function FeedbackSection({ 
  question,
  feedback,
  isCorrect,
  onRetry,
  onNextQuestion
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Add useEffect for MathJax rendering
  useEffect(() => {
    if (window.MathJax && (feedback?.analysis || showSolution)) {
      window.MathJax.typesetPromise?.()
        .catch((err) => console.error('MathJax typesetting failed:', err));
    }
  }, [feedback, showSolution]); // Re-run when feedback or solution changes

  // Add this console log to check the full question object
  useEffect(() => {
    console.log('Full question object:', question);
    console.log('Question Type:', question?.question?.type);  // Changed to access question.question.type
    console.log('Is Multiple Choice:', question?.question?.type === 'multiple_choice');
  }, [question]);

  // Add console log to check isCorrect value
  useEffect(() => {
    console.log('isCorrect:', isCorrect);
    console.log('feedback:', feedback);
  }, [isCorrect, feedback]);

  // Make sure isCorrect is properly derived from feedback
  const isCorrectMemo = useMemo(() => {
    if (!feedback?.assessment) return false;
    if (question?.question?.type === 'multiple_choice') {
      return feedback.assessment.is_correct;
    }
    return feedback.assessment.correctness_percentage >= 80;
  }, [feedback, question]);

  // Helper function for color based on score
  const getColorByScore = (score) => {
    if (score >= 80) return '#2e7d32';  // Green
    if (score >= 55) return '#ed6c02';  // Orange
    return '#d32f2f';  // Red
  };

  // Get the current color based on question type and score
  const getCurrentColor = () => {
    if (question?.question?.type === 'multiple_choice') {
      return feedback?.assessment?.correctness_percentage === 100 ? '#2e7d32' : '#d32f2f';  // Green for 100, Red for 0
    }
    // For other question types
    const score = feedback?.assessment?.correctness_percentage || 0;
    if (score >= 80) return '#2e7d32';  // Green
    if (score >= 55) return '#ed6c02';  // Orange
    return '#d32f2f';  // Red
  };

  // Auto-expand solution for multiple choice questions
  useEffect(() => {
    if (question?.question?.type === 'multiple_choice') {
      setShowSolution(true);
    }
  }, [question]);

  if (isProcessing) {
    return (
      <Fade in={true}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <FeedbackLoadingAnimation />
        </Paper>
      </Fade>
    );
  }

  if (!feedback || !feedback.assessment) {
    return null;
  }

  const isLowScore = feedback.assessment.correctness_percentage < 50;

  return (
    <Fade in={true}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        {/* Header with Assessment - matching answer input header style */}
        <Box sx={{ 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Assessment Text */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Rubik, Arial, sans-serif',
                color: getCurrentColor(),
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '1.5rem'
              }}
            >
              {question?.question?.type === 'multiple_choice' ? (
                // Multiple Choice - Show צדקת/טעית based on 100/0
                feedback?.assessment?.correctness_percentage === 100 ? (
                  <>
                    <CheckCircleIcon sx={{ fontSize: '1.5rem' }} />
                    צדקת
                  </>
                ) : (
                  <>
                    <CancelIcon sx={{ fontSize: '1.5rem' }} />
                    טעית
                  </>
                )
              ) : (
                // Other question types - Show icon before text
                (() => {
                  const score = feedback.assessment.correctness_percentage;
                  return (
                    <>
                      {score >= 55 ? (
                        score >= 80 ? (
                          <CheckCircleIcon sx={{ fontSize: '1.5rem', color: '#2e7d32' }} />
                        ) : (
                          <CheckCircleIcon sx={{ fontSize: '1.5rem', color: '#ed6c02' }} />
                        )
                      ) : (
                        <CancelIcon sx={{ fontSize: '1.5rem', color: '#d32f2f' }} />
                      )}
                      {score >= 95 ? 'מצוין!' : 
                       score >= 80 ? 'טוב מאוד!' :
                       score >= 70 ? 'טוב' :
                       score >= 60 ? 'בסדר' :
                       score >= 55 ? 'עברת' :
                       'צריך שיפור'}
                    </>
                  );
                })()
              )}
            </Typography>
            {/* Show percentage only for non-multiple-choice questions */}
            {question?.question?.type !== 'multiple_choice' && (  // Fixed type check
              <Typography 
                component="span"
                sx={{ 
                  fontSize: '1.5rem',
                  color: getColorByScore(feedback?.assessment?.correctness_percentage || 0),
                  fontWeight: 600
                }}
              >
                {feedback?.assessment?.correctness_percentage}%
              </Typography>
            )}
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Retry Icon */}
            <Tooltip title="נסה שוב" placement="bottom">
              <IconButton
                onClick={onRetry}
                size="small"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  },
                  padding: '8px',  // Increased padding
                  '& svg': {
                    fontSize: '1.75rem',  // Increased icon size
                    strokeWidth: 1.5,  // Added stroke width
                    stroke: 'currentColor'  // Added stroke color
                  }
                }}
              >
                <ReplayIcon />
              </IconButton>
            </Tooltip>

            {/* Next Question Icon */}
            <Tooltip title="שאלה הבאה" placement="bottom">
              <IconButton
                onClick={onNextQuestion}
                size="small"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  },
                  padding: '8px',  // Increased padding
                  '& svg': {
                    fontSize: '1.75rem',  // Increased icon size
                    strokeWidth: 1.5,  // Added stroke width
                    stroke: 'currentColor'  // Added stroke color
                  }
                }}
              >
                <NavigateNextIcon sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Feedback Content */}
        {question?.question?.type !== 'multiple_choice' && feedback?.analysis && (
          <Box sx={{ 
            mb: 3,
            '& > *:last-child': {
              mb: 0
            }
          }}>
            {/* Feedback sections with consistent styling */}
            {feedback.analysis.correct_parts && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#000000'
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: '1.2rem', color: '#2e7d32' }} />
                  נכון
                </Typography>
                <div 
                  style={{ 
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#2c3e50',
                    fontFamily: 'Rubik, Arial, sans-serif',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: feedback.analysis.correct_parts
                  }}
                />
              </Box>
            )}

            {/* Similar styling for mistakes and guidance sections */}
            {feedback.analysis.mistakes && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#000000'
                  }}
                >
                  <CancelIcon sx={{ fontSize: '1.2rem', color: '#d32f2f' }} />
                  שגוי
                </Typography>
                <div 
                  style={{ 
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#2c3e50',
                    fontFamily: 'Rubik, Arial, sans-serif',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: feedback.analysis.mistakes
                  }}
                />
              </Box>
            )}

            {feedback.analysis.guidance && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#000000'
                  }}
                >
                  <AutoFixHighIcon sx={{ fontSize: '1.2rem', color: '#1976d2' }} />
                  שיפור
                </Typography>
                <div 
                  style={{ 
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#2c3e50',
                    fontFamily: 'Rubik, Arial, sans-serif',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: feedback.analysis.guidance
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Solution Section */}
        {question?.solution && (
          <Box sx={{ 
            mt: question?.question?.type === 'multiple_choice' ? 0 : 3
          }}>
            {question?.question?.type === 'multiple_choice' ? (
              // Multiple choice explanation with light blue background and nice border
              <Box sx={{ 
                backgroundColor: '#f0f7ff',
                borderRadius: '8px',
                p: 3,
                border: '1px solid rgba(25, 118, 210, 0.2)',  // Light blue border
                position: 'relative',
                '&::before': {  // Left border accent
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '80%',
                  backgroundColor: '#1976d2',
                  borderRadius: '0 2px 2px 0'
                }
              }}>
                <div style={{ 
                  direction: 'rtl',
                  textAlign: 'right',
                  color: '#2c3e50',
                  fontFamily: 'Rubik, Arial, sans-serif',
                  fontSize: '1rem',
                  lineHeight: '1.8'
                }}>
                  <span style={{ 
                    fontWeight: 700,
                    color: '#000000',
                    marginRight: '4px'
                  }}>
                    הסבר:
                  </span>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: question.solution.explanation
                    }} 
                  />
                </div>
              </Box>
            ) : (
              <>
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  sx={{ 
                    width: '100%',
                    p: 2.5,
                    color: '#1976d2',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                      backgroundColor: '#f1f3f5',
                      border: '1px solid rgba(25, 118, 210, 0.3)'
                    },
                    display: 'flex',
                    justifyContent: 'flex-start',
                    '& .MuiButton-startIcon': {
                      marginLeft: '12px',
                      marginRight: '-4px',
                      order: 2,
                      '& svg': {
                        fontSize: '1.5rem'
                      }
                    }
                  }}
                  startIcon={showSolution ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: 'Rubik, Arial, sans-serif',
                      fontSize: '1.25rem',
                      textAlign: 'right',
                      color: '#1976d2',
                      order: 1
                    }}
                  >
                    הצג פתרון מלא
                  </Typography>
                </Button>
                <Collapse in={showSolution}>
                  <Box sx={{ 
                    p: 3,
                    backgroundColor: '#ffffff'
                  }}>
                    {/* Explanation and Steps */}
                    <Box sx={{ 
                      p: 3,
                      backgroundColor: '#f1f5f9',  // Darker gray background
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <div 
                        style={{ 
                          direction: 'rtl',
                          textAlign: 'right',
                          color: '#1a202c',
                          fontFamily: 'Rubik, Arial, sans-serif',
                          fontSize: '1rem',
                          lineHeight: '1.6'
                        }}
                      >
                        {/* Explanation content */}
                        {question.solution.explanation && (
                          <div 
                            style={{ 
                              marginBottom: '24px',
                              textAlign: 'right',
                              lineHeight: 1.8
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: question.solution.explanation
                            }} 
                          />
                        )}

                        {/* Steps content */}
                        {question.solution.steps && question.solution.steps.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <div style={{ 
                              color: '#000000',
                              fontWeight: 700,
                              marginBottom: '8px',
                              fontFamily: 'Rubik, Arial, sans-serif',
                              direction: 'rtl',
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}>
                              שלבי פתרון:
                            </div>
                            <div style={{ paddingRight: '16px' }}>
                              {question.solution.steps.map((step, index) => (
                                <div 
                                  key={index}
                                  style={{ 
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    color: '#1a202c'  // Darker gray
                                  }}
                                >
                                  <span style={{ fontWeight: 600, minWidth: '24px' }}>
                                    {index + 1}.
                                  </span>
                                  <div 
                                    style={{ 
                                      textAlign: 'right',
                                      lineHeight: 1.8,
                                      color: '#1a202c'  // Darker gray
                                    }}
                                    dangerouslySetInnerHTML={{ 
                                      __html: step.explanation
                                    }} 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Box>

                    {/* Final Answer with darker background */}
                    {question.solution.final_answer && (
                      <Box sx={{ 
                        p: 3,
                        backgroundColor: '#e2e8f0',  // Even darker gray for final answer
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ 
                          color: '#000000',
                          fontWeight: 700,
                          marginBottom: '12px',
                          fontFamily: 'Rubik, Arial, sans-serif',
                          direction: 'rtl',
                          display: 'flex',
                          justifyContent: 'flex-start',
                          fontSize: '1.1rem'
                        }}>
                          תשובה סופית:
                        </div>
                        <div 
                          style={{ 
                            direction: 'rtl',
                            textAlign: 'right',
                            lineHeight: 1.8,
                            color: '#000000',
                            fontFamily: 'Rubik, Arial, sans-serif',
                            fontSize: '1.1rem',
                            fontWeight: 500
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: question.solution.final_answer
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </>
            )}
          </Box>
        )}

        {/* Bottom Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 3
        }}>
          <Stack 
            direction="row" 
            spacing={1}
          >
            {/* Retry Button - Leftmost */}
            <Button
              variant="contained"
              onClick={onRetry}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                },
                padding: '6px 16px'
              }}
            >
              <>
                נסה שוב
                <ReplayIcon sx={{ marginRight: 1 }} />
              </>
            </Button>

            {/* Next Question Button */}
            <Button
              variant="contained"
              onClick={onNextQuestion}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                },
                padding: '6px 16px'
              }}
            >
              <>
                שאלה הבאה
                <NavigateNextIcon sx={{ 
                  marginRight: 1,
                  transform: 'rotate(180deg)'  // Rotate arrow for RTL
                }} />
              </>
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Fade>
  );
}

export default FeedbackSection; 