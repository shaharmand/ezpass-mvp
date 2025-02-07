import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, Typography, Fade } from '@mui/material';
import { generateFeedback } from '../services/feedbackService';

const AnswerSection = ({ answer, setAnswer, question, onFeedback, onSubmit, disabled }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(!!question);

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

  // Add this effect to reset submission state when disabled changes to false (retry clicked)
  useEffect(() => {
    if (!disabled) {
      setHasSubmitted(false);
      setIsSubmitting(false);
    }
  }, [disabled]);

  // Don't render anything if not visible
  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || disabled) return;

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

  const renderAnswerInput = () => {
    if (question?.question?.type === 'multiple_choice') {
      return (
        <Box sx={{
          mb: 2,
          backgroundColor: (isSubmitting || hasSubmitted || disabled) ? '#f8f9fa' : '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: '4px',
          padding: '13px 14px',
          '&:hover': {
            borderColor: (isSubmitting || hasSubmitted || disabled) ? 'rgba(0, 0, 0, 0.23)' : '#000000',
          }
        }}>
          <RadioGroup
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          >
            {question.question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={
                  <Typography 
                    sx={{ 
                      textAlign: 'right',
                      color: '#2c3e50'
                    }}
                  >
                    {option}
                  </Typography>
                }
                disabled={isSubmitting || hasSubmitted || disabled}
                sx={{
                  direction: 'rtl',
                  '& .MuiFormControlLabel-label': {
                    width: '100%'
                  },
                  // Override disabled opacity
                  '&.Mui-disabled': {
                    color: '#2c3e50'
                  }
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      );
    }

    return (
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={6}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="הקלד את תשובתך כאן..."
        disabled={isSubmitting || hasSubmitted || disabled}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            // Override disabled styles
            '&.Mui-disabled': {
              backgroundColor: '#f8f9fa',
              '& .MuiOutlinedInput-input': {
                color: '#2c3e50',
                WebkitTextFillColor: '#2c3e50', // Override WebKit default styling
                opacity: 1,
              }
            }
          },
          // Override disabled text color
          '& .MuiInputBase-input.Mui-disabled': {
            color: '#2c3e50',
            WebkitTextFillColor: '#2c3e50', // Override WebKit default styling
            opacity: 1,
          }
        }}
      />
    );
  };

  return (
    <Fade in={!!question} timeout={300}>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          width: '100%',
          p: 4,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05)'
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
            תשובה
          </Typography>
        </Box>
        {renderAnswerInput()}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!answer.trim() || disabled}
            sx={{
              mt: 2,
              minWidth: 120,
              alignSelf: 'flex-start'
            }}
          >
            שלח
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default AnswerSection; 