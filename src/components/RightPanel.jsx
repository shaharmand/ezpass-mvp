import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Divider, Tooltip, Collapse, Button, Tabs, Tab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/material/Link';

const getMockResponse = (userMessage) => {
  // List of possible mock responses
  const responses = [
    {
      type: 'assistant',
      title: 'תשובה',
      content: `אני שמח לעזור! 
בהתבסס על השאלה שלך, אני ממליץ:
1. לקרוא את השאלה שוב בעיון
2. לארגן את הנתונים בצורה ברורה
3. לחשוב על הקשר בין המושגים השונים

האם תרצה שאסביר משהו יותר לעומק?`
    },
    {
      type: 'assistant',
      title: 'הצעה',
      content: `אני מבין את השאלה שלך. 
בוא ננסה לפרק אותה לחלקים קטנים יותר:
• קודם כל, חשוב להבין את המטרה
• אחר כך, נזהה את הנתונים הרלוונטיים
• ולבסוף, נחשוב על דרך הפתרון

האם זה עוזר? אשמח להרחיב על כל אחד מהשלבים.`
    },
    {
      type: 'assistant',
      title: 'עצה',
      content: `זו שאלה מעניינת! 
הנה כמה נקודות למחשבה:
• נסה לחשוב על מקרים דומים שפתרת בעבר
• שים לב לפרטים הקטנים בשאלה
• חשוב על הנוסחאות שיכולות להתאים כאן

רוצה שנעבור על זה יחד?`
    }
  ];

  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

const RightPanel = ({ messages = [], onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const [showResources, setShowResources] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'resources'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Create user message
    const userMessage = {
      type: 'user',
      text: inputText.trim()
    };

    // Add user message to chat
    onSendMessage(userMessage);

    // Get and add mock response
    setTimeout(() => {
      const mockResponse = getMockResponse(inputText);
      onSendMessage(mockResponse);
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

  // This function will be passed down to QuestionDisplay and AnswerSection
  const handleNewMessage = (message) => {
    // Assuming you want to add this message to the existing messages
    // You might want to update this part to handle adding new messages
    // or to pass the new message to a parent component
  };

  return (
    <Box dir="rtl" sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab 
            icon={<SmartToyIcon />} 
            label="איזי" 
            value="chat"
          />
          <Tab 
            icon={<LibraryBooksIcon />} 
            label="חומר עזר" 
            value="resources"
          />
        </Tabs>
      </Box>

      {/* Chat Content */}
      <Box 
        sx={{ 
          display: activeTab === 'chat' ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Header with robot icon - updated colors */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SmartToyIcon sx={{ 
            color: '#2c3e50', // Changed to dark color
            fontSize: '1.75rem'
          }} />
          <div style={{
            fontWeight: 'bold',
            color: '#2c3e50', // Changed to dark color
            fontSize: '1.5rem', // Made slightly bigger to match other headers
            fontFamily: 'Rubik, Arial, sans-serif',
            flexGrow: 1
          }}>
            איזי
          </div>
          <Tooltip title="חומר עזר" placement="bottom">
            <IconButton
              onClick={() => setShowResources(!showResources)}
              size="small"
              sx={{ 
                color: showResources ? 'primary.main' : '#2c3e50',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              <LibraryBooksIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Resources Panel - slides in from the side */}
        <Collapse in={showResources}>
          <Box sx={{ 
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            bgcolor: '#f8f9fa'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              חומר עזר
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                startIcon={<VideoLibraryIcon />}
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                סרטוני הסבר
              </Button>
              <Button
                startIcon={<DescriptionIcon />}
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                סיכומים ומסמכים
              </Button>
              <Button
                startIcon={<LinkIcon />}
                variant="outlined"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                קישורים שימושיים
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Messages Area */}
        <Box dir="rtl" sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#ffffff'
        }}>
          {messages.map((message, index) => (
            <Paper
              key={index}
              elevation={0}
              dir="rtl"
              sx={{
                p: 2,
                backgroundColor: message.type === 'assistant' 
                  ? '#F5F9FF'
                  : '#F5F5F5',
                border: '1px solid',
                borderColor: message.type === 'assistant'
                  ? '#E8F1FF'
                  : '#E0E0E0',
                borderRadius: 2,
                maxWidth: '90%',
                alignSelf: 'flex-start',
                width: 'fit-content',
                minWidth: '200px',
                marginRight: 'auto'
              }}
            >
              {message.title && (
                <>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#333333',
                    marginBottom: '8px',
                    fontFamily: 'Rubik, Arial, sans-serif',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}>
                    {message.title}
                  </div>
                  <Divider sx={{ mb: 2 }} />
                </>
              )}
              <div 
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
                    ? message.content.replace(
                        /<span style="color: #1976d2">/g, 
                        '<span style="color: #1976d2 !important">'
                      )
                    : message.text
                }}
              />
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
          position: 'relative'
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
                padding: '8px 14px',
                paddingRight: '48px',
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: 'Rubik, Arial, sans-serif'
              }
            }}
            sx={{
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
          
          <IconButton 
            color="primary"
            onClick={handleSend}
            sx={{
              position: 'absolute',
              right: '16px',
              bottom: '16px',
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            <SendIcon sx={{ 
              transform: 'scaleX(-1)', // This will flip the icon horizontally
              color: '#2c3e50' 
            }} />
          </IconButton>
        </Box>
      </Box>

      {/* Resources Content */}
      <Box 
        sx={{ 
          display: activeTab === 'resources' ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          overflow: 'auto',
          p: 2
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>חומר עזר</Typography>
        
        {/* Videos Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          🎥 סרטוני הסבר
        </Typography>
        <Box sx={{ mb: 4 }}>
          {/* Example video links */}
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • הסבר מקיף על נגזרות
          </Link>
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • תרגול מודרך - בעיות קיצון
          </Link>
        </Box>

        {/* Documents Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          📚 סיכומים ומסמכים
        </Typography>
        <Box sx={{ mb: 4 }}>
          {/* Example document links */}
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • דף נוסחאות מורחב
          </Link>
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • מאגר שאלות פתורות
          </Link>
        </Box>

        {/* External Links Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          🔗 קישורים שימושיים
        </Typography>
        <Box sx={{ mb: 4 }}>
          {/* Example external links */}
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • מחשבון גרפי אונליין
          </Link>
          <Link href="#" target="_blank" sx={{ display: 'block', mb: 1 }}>
            • תרגול אינטראקטיבי
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RightPanel; 