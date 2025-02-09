import React, { useState, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Divider, Fade, Grow, Skeleton, LinearProgress, Alert } from '@mui/material';
import OpenAI from 'openai';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeEditor from '@uiw/react-textarea-code-editor';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FastForwardIcon from '@mui/icons-material/FastForward';
import { 
  getQuestionExplanation, 
  getSolutionGuide, 
  getHint, 
  getFullSolution,
  getResources
} from '../services/assistanceService';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Update QuestionSkeleton component
const QuestionSkeleton = () => (
  <Fade in={true}>
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
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
            mb: 1
          }}
        >
          מייצר שאלה חדשה...
        </Typography>
        <LinearProgress 
          sx={{ 
            width: '60%', 
            mb: 2,
            height: 6,
            borderRadius: 3
          }}
        />
      </Box>

      <Grow in={true} timeout={800}>
        <Box>
          <Skeleton 
            animation="wave" 
            height={24} 
            width="90%" 
            sx={{ mb: 1 }}
          />
          <Skeleton 
            animation="wave" 
            height={24} 
            width="75%" 
            sx={{ mb: 2 }}
          />
          <Skeleton 
            animation="wave" 
            height={20} 
            width="60%" 
          />
        </Box>
      </Grow>

      <Grow in={true} timeout={1200}>
        <Box sx={{ mt: 4 }}>
          <Skeleton 
            animation="wave" 
            height={100} 
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton 
              animation="wave" 
              height={36} 
              width={120}
            />
          </Box>
        </Box>
      </Grow>
    </Paper>
  </Fade>
);

// Create a memoized question content component
const QuestionContent = memo(({ question }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
        .catch((err) => console.error('MathJax typesetting failed:', err));
    }
  }, [question]);

  if (!question) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <div 
        dangerouslySetInnerHTML={{ __html: question.question.text }}
        style={{ 
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 1.8,
          color: '#2c3e50',
          fontFamily: 'Rubik, Arial, sans-serif',
          fontSize: '1.125rem',
          fontWeight: 500,
        }}
      />
      {question.question.instruction && (
        <div
          style={{ 
            marginTop: '16px',
            color: 'rgba(0, 0, 0, 0.7)',
            direction: 'rtl',
            textAlign: 'right',
            fontFamily: 'Rubik, Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
          }}
        >
          {question.question.instruction}
        </div>
      )}
    </Box>
  );
});

const QuestionDisplay = forwardRef(({ 
  selectedSubject, 
  selectedExam, 
  selectedTopic, 
  selectedSubtopic,
  selectedTopics,
  onQuestionGenerated,
  onSkipQuestion,
  onQuestionSkipped,
  onSendMessage,
  setChatMessages
}, ref) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Update the MathJax configuration useEffect
  useEffect(() => {
    const configureMathJax = () => {
      if (!window.MathJax) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js';
        script.async = true;
        
        window.MathJax = {
          tex: {
            inlineMath: [['\\(', '\\)']],
            displayMath: [['\\[', '\\]']],
            processEscapes: true,
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
          },
          startup: {
            typeset: false
          }
        };

        script.onload = () => {
          if (window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
          }
        };

        document.head.appendChild(script);
      }
    };

    configureMathJax();
  }, []);

  // Update the MathJax typesetting useEffect
  useEffect(() => {
    if (window.MathJax && question) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        if (window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise()
            .catch((err) => console.error('MathJax typesetting failed:', err));
        } else if (window.MathJax.Hub) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
      }, 100);
    }
  }, [
    question,  // Only re-render when question changes
    showSolution // Or when solution is shown/hidden
  ]);

  // Add this useEffect for initial check
  useEffect(() => {
    console.log('Environment Variables Check:');
    console.log('All env vars:', process.env);
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    console.log('API Key check:');
    console.log('- Key defined:', apiKey !== undefined);
    console.log('- Key type:', typeof apiKey);
    console.log('- Key starts with:', apiKey?.substring(0, 6));
    console.log('- Key length:', apiKey?.length);
    console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY ? 'Exists' : 'Missing');
  }, []);

  // Detailed logging of props
  useEffect(() => {
    console.log('QuestionDisplay Props:', {
      subject: {
        id: selectedSubject?.id,
        name: selectedSubject?.name
      },
      exam: {
        id: selectedExam?.id,
        name: selectedExam?.name
      },
      topic: {
        id: selectedTopic?.id,
        name: selectedTopic?.name
      },
      subtopic: {
        id: selectedSubtopic?.id,
        name: selectedSubtopic?.name
      }
    });
  }, [selectedSubject, selectedExam, selectedTopic, selectedSubtopic]);

  // Add detailed logging for selections
  useEffect(() => {
    console.log('QuestionDisplay received:', {
      subject: selectedSubject?.name,
      exam: selectedExam?.name,
      topic: selectedTopic?.name,
      subtopic: selectedSubtopic?.name
    });
  }, [selectedSubject, selectedExam, selectedTopic, selectedSubtopic]);

  // Generate question when exam selection changes
  /*useEffect(() => {
    if (selectedExam) {
      generateQuestion();
    }
  }, [selectedExam?.id]);*/

  // Add a new useEffect for MathJax rendering
  useEffect(() => {
    if (window.MathJax && question) {
      window.MathJax.typesetPromise?.()
        .catch((err) => console.error('MathJax typesetting failed:', err));
    }
  }, [question]); // Re-run when question changes

  const renderMathText = (text) => {
    if (!text) return null;
    
    // Clean up the text:
    // 1. Remove double backslashes
    // 2. Replace \angle with \alpha, \beta, etc.
    const cleanText = text
      .replace(/\\\\/g, '')  // Remove line breaks
      .replace(/\\angle\s*A/g, '\\( \\alpha \\)')
      .replace(/\\angle\s*B/g, '\\( \\beta \\)')
      .replace(/\\angle\s*C/g, '\\( \\gamma \\)');
    
    return (
      <Typography 
        component="div" 
        dangerouslySetInnerHTML={{ __html: cleanText }}
        sx={{ 
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 1.6,
          color: '#2c3e50',
          fontSize: '18px',  // Increased font size
          fontFamily: 'Rubik, Arial, sans-serif',
          '& .MathJax': {
            fontSize: '120%',  // Slightly larger math
            margin: '0 4px',
          }
        }}
      />
    );
  };

  const getRandomTopic = (topics, exam) => {
    // Filter out any undefined or invalid topics
    const validTopics = (topics || []).filter(Boolean);
    
    if (!validTopics?.length) {
      return 'general topic';
    }
    
    const randomIndex = Math.floor(Math.random() * validTopics.length);
    const randomTopicId = validTopics[randomIndex];
    
    // Find the topic object in exam.topics
    const topicObject = exam?.topics?.find(t => t.id === randomTopicId);
    
    return topicObject?.name || 'general topic';
  };

  const generateQuestion = async (newSelections = null, retryCount = 0) => {
    if (!selectedExam && !newSelections?.exam) return;
    
    // Use new selections if provided, otherwise use current state
    const currentExam = newSelections?.exam || selectedExam;
    const currentTopics = newSelections?.topics || selectedTopics;
    
    // Don't retry more than 3 times
    if (retryCount > 3) {
      setError('אירעה שגיאה ביצירת השאלה. אנא נסה שוב.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowSolution(false);
    try {
      const topic = getRandomTopic(currentTopics, currentExam);
      
      // Determine question type based on subject
      let questionType;
      switch(selectedSubject?.name) {
        case 'מתמטיקה':
        case 'פיזיקה':
          questionType = 'step_by_step_solution';
          break;
        case 'מדעי המחשב':
          questionType = 'code_implementation';
          break;
        case 'הנדסה אזרחית':
          questionType = Math.random() < 0.5 ? 'multiple_choice' : 'essay';
          break;
        default:
          questionType = Math.random() < 0.5 ? 'multiple_choice' : 'essay';
      }

      const prompt = `Create a ${selectedSubject?.name}, ${currentExam.name} exam question in Hebrew about ${topic}.
        
      Question requirements:
      - Question type: "${questionType}"
      - Question should be clear and focused on testing understanding
      - Use proper Hebrew terminology for the subject
      
      Return a JSON object with this structure (no additional text, only valid JSON):
      {
        "question": {
          "type": "${questionType}",
          "text": "שאלה בעברית"${questionType === 'multiple_choice' ? ',\n    "options": ["א. תשובה", "ב. תשובה", "ג. תשובה", "ד. תשובה"]' : ''}${questionType === 'code_implementation' ? ',\n    "code_template": "// קוד התחלתי כאן"' : ''}
        },
        "solution": {
          "explanation": "הסבר מלא של הפתרון"${questionType === 'step_by_step_solution' ? `,
          "steps": [
            {
              "explanation": "הסבר של השלב"
            }
          ]` : ''}${['step_by_step_solution', 'multiple_choice'].includes(questionType) ? ',\n    "final_answer": "התשובה הסופית"' : ''}
        }
      }`;

      console.log('=== Question Generation Request ===');
      console.log('Subject:', selectedSubject?.name);
      console.log('Exam:', currentExam?.name);
      console.log('Topic:', topic);
      console.log('Type:', questionType);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional ${selectedSubject?.name} teacher with extensive experience preparing students for ${currentExam?.name} exams and creating exam questions.
            
            CRITICAL: All LaTeX expressions MUST be double-escaped in JSON:
            CORRECT: "נתון משולש שבו \\\\( \\\\alpha = 30^\\\\circ \\\\)"
            WRONG: "נתון משולש שבו \\( \\alpha = 30^\\circ \\)"
            
            Rules for JSON response:
            1. Use \\\\( and \\\\) for ALL math expressions
            2. Use \\\\alpha, \\\\beta, \\\\gamma (not A, B, C)
            3. Use \\\\mathrm{} for units
            4. Use \\\\, for spacing
            5. Use \\\\\\\\  for line breaks in cases
            6. Use \\\\text{} for text in math
            7. Use \\\\begin{cases} and \\\\end{cases} with proper escaping
            8. ALL backslashes must be doubled for JSON`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      // Process the response
      const questionData = completion.choices[0].message.content;
      console.log('Raw OpenAI response:', questionData);

      // Parse the JSON response
      const parsedQuestion = JSON.parse(questionData);

      // No need for additional escaping since OpenAI provides correctly escaped LaTeX
      console.log('Processed question:', parsedQuestion);

      setQuestion(parsedQuestion);
      if (onQuestionGenerated) {
        onQuestionGenerated(parsedQuestion);
      }
      setLoading(false);

    } catch (error) {
      console.error('Error in question generation:', error);
      if (retryCount < 3) {
        console.log(`Retrying question generation... (Attempt ${retryCount + 1}/3)`);
        return generateQuestion(newSelections, retryCount + 1);
      }
      setError('אירעה שגיאה ביצירת השאלה. אנא נסה שוב.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkipQuestion) {
      onSkipQuestion();
    }
    // Call onQuestionSkipped after skip is processed
    if (onQuestionSkipped) {
      onQuestionSkipped();
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
    
    const subject = selectedSubject?.name || '';
    const exam = selectedExam?.name || '';
    const topic = selectedTopic?.name || '';
    
    switch (action) {
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
    }
  };

  // Expose generateQuestion method through ref
  useImperativeHandle(ref, () => ({
    generateQuestion
  }));

  const renderQuestion = () => {
    if (!question) return null;
    return <QuestionContent question={question} />;
  };

  if (!selectedExam) {
    return (
      <Paper 
        dir="rtl"
        sx={{ 
          p: 4, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{
          color: '#2c3e50',
          fontSize: '1.25rem',
          fontFamily: 'Rubik, Arial, sans-serif',
          direction: 'rtl',
          textAlign: 'center'
        }}>
          כדי להתחיל לתרגל, הגדר את המבחן שלך בעזרת כפתור "הגדרות מבחן" למעלה 👆
        </div>
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      p: 2,
      backgroundColor: '#f8f9fa',
      borderRadius: 2,
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)',
      mb: 0.25, // Reduce to 2px
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        paddingBottom: '4px',
        paddingLeft: '16px',
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
          שאלה
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
          <Tooltip title="דלג על שאלה זו" placement="bottom">
            <IconButton
              onClick={handleSkip}
              size="small"
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                transform: 'rotate(180deg)'
              }}
            >
              <FastForwardIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <QuestionSkeleton />
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            p: 0.5,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            '& > .MuiBox-root': {
              p: 0,
              m: 0
            }
          }}
        >
          <Box sx={{ width: '100%' }}>
            {/* Question Content */}
            <Box sx={{ 
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              '& > *:last-child': {
                mb: 0
              }
            }}>
              {renderQuestion()}
            </Box>

            {/* Help Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleHelpClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  '& .MuiMenuItem-root': {
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }
                }
              }}
            >
              <MenuItem onClick={() => handleHelpAction('explanation')}>
                <ListItemIcon>
                  <HelpOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="הסבר שאלה"
                  primaryTypographyProps={{
                    sx: { color: 'primary.main' }
                  }}
                />
              </MenuItem>
              <MenuItem onClick={() => handleHelpAction('guide')}>
                <ListItemIcon>
                  <MenuBookIcon fontSize="small" sx={{ color: 'primary.main' }} />
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
        </Paper>
      )}
    </Box>
  );
});

export default QuestionDisplay; 