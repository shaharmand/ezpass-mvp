import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, Typography, Fade, Divider, Paper } from '@mui/material';
import { generateFeedback } from '../services/feedbackService';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import { 
  getQuestionExplanation, 
  getSolutionGuide, 
  getHint, 
  getFullSolution 
} from '../services/assistanceService';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const AnswerSection = ({ answer, setAnswer, question, onFeedback, onSubmit, disabled, onSendMessage, setChatMessages }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(!!question);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentHeight, setCurrentHeight] = useState('auto');

  // Add ref for textarea
  const textareaRef = React.useRef(null);

  // Reset states when question changes
  useEffect(() => {
    setHasSubmitted(false);
    setIsSubmitting(false);
    
    if (question) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [question]);

  // Don't render anything if not visible
  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || disabled) return;

    // Capture the height before any state changes
    if (textareaRef.current) {
      const height = textareaRef.current.scrollHeight;
      setCurrentHeight(`${height}px`);
    }

    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit(answer);  // This will trigger the feedback section to show
    }

    try {
      const feedback = await generateFeedback(question, answer);
      if (onFeedback) {
        onFeedback(feedback);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
    setIsSubmitting(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !hasSubmitted) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleHelpClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setAnchorEl(null);
  };

  const handleHelpAction = (action) => {
    setAnchorEl(null);
    
    const subject = question?.subject || '';
    const exam = question?.exam || '';
    const topic = question?.topic || '';
    
    switch (action) {
      case 'explanation':
        onSendMessage({
          type: 'assistant',
          content: `<strong>❓ הסבר השאלה:</strong>

בשאלה זו אנחנו נדרשים להבין מספר מושגים מרכזיים ב${topic || exam}:

1. ראשית, חשוב לזהות את הנתונים המרכזיים
2. שימו לב לדרישות השאלה - מה בדיוק מבקשים מכם
3. זכרו את העקרונות הבאים שלמדנו:
   • נקודה ראשונה חשובה
   • נקודה שנייה חשובה
   • נקודה שלישית חשובה

האם תרצו שנעבור יחד על השאלה צעד אחר צעד?`
        });
        break;

      case 'guide':
        onSendMessage({
          type: 'assistant',
          content: `<strong>📝 הדרכה לפתרון:</strong>

הנה מדריך מובנה שיעזור לכם לפתור את השאלה:

1. שלב ראשון: זיהוי הנתונים
   • רשמו את כל הנתונים שקיבלתם
   • ארגנו אותם בצורה ברורה

2. שלב שני: תכנון הפתרון
   • חשבו על הנוסחאות הרלוונטיות
   • בחרו את דרך הפתרון המתאימה

3. שלב שלישי: ביצוע
   • פתרו שלב אחר שלב
   • בדקו כל שלב בפתרון

נסו לפתור לפי השלבים האלו ואני כאן אם תצטרכו עזרה נוספת.`
        });
        break;

      case 'hint':
        onSendMessage({
          type: 'assistant',
          content: `<strong>💡 רמז לפתרון:</strong>

הנה רמז שיכול לעזור:
          
חשבו על הקשר בין הנתונים שקיבלתם. האם שמתם לב ל[נתון מרכזי]? 
זה יכול להוביל אתכם לפתרון.

נסו לחשוב על זה ואם תצטרכו, אשמח לתת רמז נוסף.`
        });
        break;

      case 'solution':
        onSendMessage({
          type: 'assistant',
          content: `<strong>✅ פתרון מלא:</strong>

הנה פתרון מפורט לשאלה:

1. ניתוח הנתונים:
   • [נתון ראשון]
   • [נתון שני]
   • [נתון שלישי]

2. דרך הפתרון:
   • שלב א': [הסבר]
   • שלב ב': [הסבר]
   • שלב ג': [הסבר]

3. התשובה הסופית:
   [תשובה]

שימו לב: חשוב להבין כל שלב בפתרון ולא רק להעתיק את התשובה.`
        });
        break;

      case 'resources':
        onSendMessage({
          type: 'assistant',
          content: `<strong>📚 חומרי עזר מומלצים:</strong>

אני שמח להמליץ על חומרי העזר הבאים ל${topic || exam}:

1. סרטוני הסבר:
   • שיעור מקיף בנושא ${topic || exam}
   • תרגול מודרך עם פתרונות מלאים

2. מסמכים וסיכומים:
   • דף נוסחאות מרוכז
   • סיכום תיאוריה ומושגים מרכזיים
   • מאגר שאלות ופתרונות

3. קישורים שימושיים:
   • מחשבון גרפי אונליין
   • סימולטור לתרגול אינטראקטיבי

אשמח להפנות אותך לחומר ספציפי שמעניין אותך.`
        });
        break;
    }
  };

  const renderAnswerInput = () => {
    if (question?.question?.type === 'multiple_choice') {
      const correctAnswer = question.solution?.final_answer;
      
      return (
        <Box sx={{
          mb: 2,
          backgroundColor: (isSubmitting || hasSubmitted || disabled) ? '#f8f9fa' : '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          '&:hover': {
            backgroundColor: (isSubmitting || hasSubmitted || disabled) ? '#f8f9fa' : '#ffffff',
          }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {question.question.options.map((option, index) => {
              const isSelected = answer === option;
              const isCorrect = disabled && option === correctAnswer;
              const isWrong = disabled && isSelected && option !== correctAnswer;
              
              return (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: isCorrect ? '#2e7d32' : // green for correct
                                isWrong ? '#d32f2f' : // red for wrong
                                isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                    backgroundColor: isCorrect ? 'rgba(46, 125, 50, 0.04)' : // light green bg
                                    isWrong ? 'rgba(211, 47, 47, 0.04)' : // light red bg
                                    isSelected ? 'rgba(25, 118, 210, 0.04)' : '#ffffff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: isCorrect ? '#2e7d32' :
                                  isWrong ? '#d32f2f' :
                                  isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
                      backgroundColor: isCorrect ? 'rgba(46, 125, 50, 0.08)' :
                                      isWrong ? 'rgba(211, 47, 47, 0.08)' :
                                      isSelected ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    cursor: (isSubmitting || hasSubmitted || disabled) ? 'default' : 'pointer',
                  }}
                  onClick={() => {
                    if (!isSubmitting && !hasSubmitted && !disabled) {
                      setAnswer(option);
                    }
                  }}
                >
                  <div
                    style={{
                      flexGrow: 1,
                      direction: 'rtl',
                      textAlign: 'right',
                      color: isCorrect ? '#2e7d32' :
                              isWrong ? '#d32f2f' :
                              '#2c3e50',
                      fontFamily: 'Rubik, Arial, sans-serif',
                      fontSize: '1rem',
                      fontWeight: (isSelected || isCorrect) ? 500 : 400,
                    }}
                  >
                    {option}
                  </div>
                </Paper>
              );
            })}
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        width: '100%',
        mb: disabled ? 0 : 2,
      }}>
        {disabled ? (
          // Read-only text display when disabled
          <Typography
            sx={{
              width: '100%',
              direction: 'rtl',
              textAlign: 'right',
              fontFamily: 'Rubik, Arial, sans-serif',
              fontSize: '18px',
              padding: '12px 16px',
              lineHeight: '1.6',
              backgroundColor: '#f8f9fa',
              color: '#2c3e50',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'  // Preserve line breaks
            }}
          >
            <div style={{ 
              direction: 'rtl', 
              textAlign: 'right',
              width: '100%'
            }}>
              {answer}
            </div>
          </Typography>
        ) : (
          // Editable TextareaAutosize when enabled
          <TextareaAutosize
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                return;
              }
            }}
            placeholder="הקלד את תשובתך כאן..."
            minRows={3}
            style={{
              width: '100%',
              direction: 'rtl',
              textAlign: 'right',
              fontFamily: 'Rubik, Arial, sans-serif',
              fontSize: '18px',
              padding: '12px 16px',
              lineHeight: '1.6',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              resize: 'none',
              boxSizing: 'border-box',
              outline: 'none',
              unicodeBidi: 'embed',  // Enhance RTL support
              writingMode: 'horizontal-tb'  // Ensure horizontal text flow
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1976d2';
              e.target.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
              e.target.style.boxShadow = 'none';
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Fade in={!!question} timeout={300}>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          width: '100%',
          p: 1,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)',
          mb: 0.25,
          height: 'auto !important',
          maxHeight: 'none !important',
          '& > *': {
            height: 'auto !important',
            maxHeight: 'none !important'
          },
          ...(disabled && {
            '& .submit-button-container': {
              display: 'none'
            },
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                height: 'auto !important',
                minHeight: 'unset'
              }
            },
            '& textarea': {
              height: 'auto !important'
            }
          })
        }}
      >
        {/* Header with internal padding */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          paddingBottom: '4px',
          paddingLeft: '16px', // Add padding inside instead
          paddingRight: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          direction: 'rtl'
        }}>
          <div
            style={{
              fontWeight: 'bold',
              color: '#2c3e50',
              flexGrow: 1,
              direction: 'rtl',
              textAlign: 'right',
              fontSize: '1.5rem',
              fontFamily: 'Rubik, Arial, sans-serif'
            }}
          >
            תשובה
          </div>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="אפשרויות עזרה" placement="bottom">
              <IconButton
                onClick={handleHelpClick}
                size="small"
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
        
        {/* Answer content with internal padding */}
        <Box sx={{ 
          px: 2,
          pb: 1,
        }}>
          {renderAnswerInput()}
          
          <Box 
            className="submit-button-container"
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              mt: 0.5
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={!answer.trim() || disabled}
              sx={{ 
                minWidth: 120,
                justifyContent: 'center'
              }}
            >
              בדיקת תשובה
            </Button>
          </Box>
        </Box>

        {/* Help Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleHelpAction('explanation')}>
            <ListItemIcon>
              <HelpOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="הסבר השאלה"
              primaryTypographyProps={{
                sx: { color: 'primary.main' }
              }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleHelpAction('guide')}>
            <ListItemIcon>
              <SchoolIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="הדרכה לפתרון"
              primaryTypographyProps={{
                sx: { color: 'primary.main' }
              }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleHelpAction('hint')}>
            <ListItemIcon>
              <LightbulbIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="רמז"
              primaryTypographyProps={{
                sx: { color: 'primary.main' }
              }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleHelpAction('solution')}>
            <ListItemIcon>
              <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="פתרון מלא"
              primaryTypographyProps={{
                sx: { color: 'primary.main' }
              }}
            />
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => handleHelpAction('resources')}>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="חומר עזר"
              primaryTypographyProps={{
                sx: { color: 'primary.main' }
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Fade>
  );
};

export default AnswerSection; 