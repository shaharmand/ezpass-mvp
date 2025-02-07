import React, { useState, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Divider, Fade, Grow, Skeleton, LinearProgress, Alert } from '@mui/material';
import OpenAI from 'openai';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeEditor from '@uiw/react-textarea-code-editor';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

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
  }, [question]); // Re-run only when question changes

  if (!question) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        component="div" 
        dangerouslySetInnerHTML={{ __html: question.question.text }}
        sx={{ 
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 1.8,
          color: '#2c3e50',
          '& .MathJax': {
            fontSize: '110%',
            margin: '0 4px',
          }
        }}
      />
      {question.question.instruction && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            color: 'text.secondary',
            direction: 'rtl',
            textAlign: 'right'
          }}
        >
          {question.question.instruction}
        </Typography>
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
  onSkipQuestion
}, ref) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

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
  useEffect(() => {
    if (selectedExam) {
      generateQuestion();
    }
  }, [selectedExam?.id]); // Only depend on the exam ID, not the entire callback

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
          lineHeight: 1.8,
          color: '#2c3e50',
          '& .MathJax': {
            fontSize: '110%',
            margin: '0 4px',
          }
        }}
      />
    );
  };

  const getRandomTopic = () => {
    console.log('Available topics:', selectedTopics); // Debug log
    
    if (!selectedTopics?.length) {
      return 'general topic';
    }
    
    // Get a random topic ID from selectedTopics
    const randomIndex = Math.floor(Math.random() * selectedTopics.length);
    const randomTopicId = selectedTopics[randomIndex];
    
    // Find the topic object in currentExam.topics
    const topicObject = selectedExam?.topics?.find(t => t.id === randomTopicId);
    
    // Return the topic name instead of ID
    return topicObject?.name || 'general topic';
  };

  const generateQuestion = async (retryCount = 0) => {
    if (!selectedExam) return;
    
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
      const topic = getRandomTopic();
      
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

      const prompt = `Create a ${selectedSubject?.name}, ${selectedExam.name} exam question in Hebrew about ${topic}.
        
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
      console.log('Exam:', selectedExam?.name);
      console.log('Topic:', topic);
      console.log('Type:', questionType);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional ${selectedSubject?.name} teacher with extensive experience preparing students for ${selectedExam?.name} exams and creating exam questions.
            
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
        return generateQuestion(retryCount + 1);
      }
      setError('אירעה שגיאה ביצירת השאלה. אנא נסה שוב.');
      setLoading(false);
    }
  };

  const handleSkipQuestion = () => {
    // Reset states
    setQuestion(null);
    setShowSolution(false);
    setError(null);
    
    // Call parent callback to reset answer and feedback BEFORE generating new question
    if (onSkipQuestion) {
      onSkipQuestion();
    }

    // Small delay before generating new question to allow fade out
    setTimeout(() => {
      generateQuestion();
    }, 300);
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
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: '#2c3e50',
            mb: 1
          }}
        >
          בחר מבחן כדי להתחיל
        </Typography>
        <Typography color="text.secondary">
          יש לבחור מקצוע לאחר מכן בחינה מהתפריטים בחלק העליון של המסך.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          ניתן גם לבחור נושאים ותתי נושאים מהתפריטים הנוספים שיופיעו לאחר בחירת הבחינה
        </Typography>
      </Paper>
    );
  }

  return (
    <>
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
            p: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.1)'
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
              שאלה
            </Typography>
          </Box>
          {renderQuestion()}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 3,
            pt: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <Button
              variant="outlined"
              onClick={handleSkipQuestion}
              disabled={loading}
              endIcon={<SkipPreviousIcon />}
              sx={{ 
                minWidth: 120,
                color: '#1976d2',
                borderColor: '#1976d2',
                padding: '6px 10px',
                '& .MuiButton-endIcon': {
                  margin: 0,
                  marginRight: '2px',
                },
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              דלג
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
});

export default QuestionDisplay; 