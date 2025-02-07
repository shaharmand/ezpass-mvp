import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function RightPanel() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'שלום! אני כאן לעזור לך. במה אוכל לסייע?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: inputText
    }]);

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'אני מבין את השאלה שלך. אשמח לעזור! האם תוכל להסביר יותר בפירוט?'
      }]);
    }, 1000);

    // Clear input
    setInputText('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
    }}>
      {/* Header with fixed right alignment */}
      <Box sx={{ 
        px: 2.5,
        pt: 3,
        pb: 2.5,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#ebedf0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        direction: 'rtl'  // Add RTL direction to header container
      }}>
        <Typography 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: 'right',  // Ensure text alignment
            width: '100%'  // Take full width
          }}
        >
          <span style={{ 
            fontWeight: 800,
            color: '#1a202c',
            order: 1  // Control order in flexbox
          }}>
            איזי
          </span>
          <span style={{ 
            color: '#4a5568',
            fontWeight: 600,
            order: 2  // Control order in flexbox
          }}>
            - המורה האישי שלך
          </span>
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1, 
        p: 2,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        direction: 'rtl',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.map((message, index) => (
          <Box 
            key={index}
            sx={{ 
              alignSelf: message.type === 'ai' ? 'flex-start' : 'flex-end',
              maxWidth: '80%',
              backgroundColor: message.type === 'ai' ? '#ffffff' : '#edf2f7',
              p: 1.5,
              borderRadius: message.type === 'ai' ? '15px 0 15px 15px' : '0 15px 15px 15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: message.type === 'ai' ? '1px solid #e0e0e0' : 'none'
            }}
          >
            <Typography sx={{ 
              textAlign: 'right',
              color: '#4a5568'
            }}>
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Input Area - Using absolute positioning for send button */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        position: 'relative',  // For absolute positioning of button
        direction: 'rtl'  // Ensure RTL layout
      }}>
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
              textAlign: 'right',
              direction: 'rtl',
              padding: '8px 14px',
              paddingLeft: '48px'  // Make space for the button
            }
          }}
          sx={{
            '& .MuiInputBase-root': {
              direction: 'rtl',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
        />
        
        <IconButton 
          color="primary"
          onClick={handleSend}
          sx={{
            position: 'absolute',
            left: '16px',  // Align with padding
            bottom: '16px',  // Align with padding
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0'
            }
          }}
        >
          <SendIcon sx={{ transform: 'rotate(180deg)', color: '#2c3e50' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default RightPanel; 