import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Divider, Tooltip, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TuneIcon from '@mui/icons-material/Tune';
import SchoolIcon from '@mui/icons-material/School';

const Assistance = ({ messages = [], onSendMessage, onOpenSettings, selectedExam }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Modified scroll behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          messagesEndRef.current.scrollIntoView({
            behavior: 'auto', // Changed from smooth to auto
            block: 'end'
          });
        } catch (error) {
          console.error('Scroll error:', error);
        }
      });
    }
  }, [messages]); // Only run when messages change

  // Move getMockResponse here so it has access to onOpenSettings
  const getMockResponse = () => {
    const responses = [
      {
        type: 'assistant',
        title: 'תשובה',
        content: `אני יכול לעזור לך בכל נושא שתרצה. 
איזה עזרה אתה צריך?`
      },
      {
        type: 'assistant',
        title: 'הצעה',
        content: `אשמח לעזור! אפשר:
• לענות על שאלות שיש לך
• להסביר נושאים מסוימים
• לתת טיפים ללמידה יעילה
• לעזור בהבנת שאלות קשות

במה תרצה שנתמקד?`
      },
      {
        type: 'assistant',
        title: 'עצה',
        content: `אני כאן כדי לעזור! 
אפשר לשאול כל שאלה, ואשתדל לתת לך את התשובה הטובה ביותר.`
      }
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Send user message
    onSendMessage({
      type: 'user',
      text: inputText.trim()
    });

    // Clear input
    setInputText('');

    // Send mock response after a short delay
    setTimeout(() => {
      const mockResponse = getMockResponse();  // No need to pass userMessage anymore
      onSendMessage(mockResponse);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const initialMessages = [{
    type: 'assistant',
    title: 'היי! 👋',
    content: `אני איזי, המורה הפרטי שלך שיעזור לך להצליח במבחן! 🎯

ככה נעבוד יחד:
• אציג לך שאלות מותאמות אישית
• תוכל לקבל עזרה והכוונה בכל שלב
• תקבל פידבק מפורט על כל תשובה
• נזהה יחד את הנושאים שדורשים חיזוק
• נעקוב אחר ההתקדמות עד שתהיה מוכן למבחן

כדי להתחיל, בוא נגדיר את המבחן שלך בעזרת הכפתור למטה.
אני כבר מחכה להתחיל לתרגל יחד! 💪`,
    action: {
      type: 'button',
      label: 'הגדרות מבחן',
      icon: <TuneIcon />,
      onClick: onOpenSettings
    }
  }];

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      position: 'relative'  // Add this to ensure proper stacking
    }}>
      {/* Messages Area */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '64px',
        overflowY: 'auto',
        p: 2,
        backgroundColor: '#ffffff',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      }}>
        {/* Show all messages including welcome */}
        {[initialMessages[0], ...messages].map((message, index) => (
          <Paper
            key={`message-${index}`}
            elevation={0}
            dir="rtl"
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: message.type === 'assistant' ? '#F5F9FF' : '#F5F5F5',
              border: '1px solid',
              borderColor: message.type === 'assistant' ? '#E8F1FF' : '#E0E0E0',
              borderRadius: 2,
              maxWidth: '90%',
              alignSelf: 'flex-start',
              width: 'fit-content',
              minWidth: '200px',
              marginLeft: '24px',
              marginRight: '0'
            }}
          >
            {message.title && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <div style={{
                  fontWeight: 'bold',
                  color: '#333333',
                  marginBottom: '8px',
                  fontFamily: 'Rubik, Arial, sans-serif',
                  direction: 'rtl',
                  textAlign: 'right',
                  width: '100%'
                }}>
                  {message.title}
                </div>
                <Divider sx={{ mt: 1 }} />
              </Box>
            )}
            <div 
              dir="rtl"
              style={{
                whiteSpace: 'pre-wrap',
                color: '#333333',
                fontFamily: 'Rubik, Arial, sans-serif',
                direction: 'rtl',
                textAlign: 'right',
                width: '100%'
              }}
              dangerouslySetInnerHTML={{ 
                __html: message.type === 'assistant' 
                  ? message.content.replace(/<span style="color: #1976d2">/g, '<span style="color: #1976d2 !important">')
                  : message.text
              }}
            />
            {message.action && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant={selectedExam ? "outlined" : "contained"}
                  startIcon={message.action.icon}
                  onClick={message.action.onClick}
                  sx={{
                    ...(selectedExam ? {
                      color: '#1976d2',
                      borderColor: 'rgba(25, 118, 210, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        borderColor: '#1976d2'
                      },
                    } : {
                      backgroundColor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1565c0'
                      },
                    })
                  }}
                >
                  {message.action.label}
                </Button>
              </Box>
            )}
          </Paper>
        ))}
        <div ref={messagesEndRef} style={{ height: 1, width: '100%' }} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        position: 'absolute',  // Change to absolute positioning
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',  // Fixed height
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        zIndex: 1  // Ensure it stays on top
      }}>
        <Box dir="ltr" sx={{ 
          display: 'flex',
          alignItems: 'center',  // Changed from flex-end
          gap: 2,
          height: '100%'  // Fill the container
        }}>
          <IconButton 
            onClick={handleSend}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            <SendIcon sx={{ 
              transform: 'scaleX(-1)',
              color: '#2c3e50' 
            }} />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            minRows={1}
            size="small"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="הקלד את הודעתך כאן..."
            inputProps={{
              style: { 
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: 'Rubik, Arial, sans-serif'
              }
            }}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                direction: 'rtl',
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Assistance; 