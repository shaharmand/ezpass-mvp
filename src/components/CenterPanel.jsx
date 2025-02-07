import React, { useState, forwardRef } from 'react';
import { Box } from '@mui/material';
import QuestionDisplay from './QuestionDisplay';
import AnswerSection from './AnswerSection';
import FeedbackSection from './FeedbackSection';

const CenterPanel = forwardRef(({ 
  setProgress, 
  selectedSubject, 
  selectedExam, 
  selectedTopic, 
  selectedSubtopic,
  selectedTopics,
  selectedSubtopics,
  onQuestionGenerated,
  onSkipQuestion
}, ref) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Handle when a new question is generated
  const handleQuestionGenerated = (question) => {
    setCurrentQuestion(question);
    setAnswer('');
    setFeedback(null);
    setIsProcessingAnswer(false);
    if (onQuestionGenerated) {
      onQuestionGenerated(question);
    }
  };

  // Handle progress updates after feedback
  const handleFeedbackReceived = (feedbackData) => {
    setFeedback(feedbackData);
    setIsProcessingAnswer(false);
    
    if (feedbackData && typeof feedbackData.assessment?.correctness_percentage === 'number') {
      setProgress(prev => ({
        completed: prev.completed + 1,
        successRate: Math.round(
          (prev.completed * prev.successRate + feedbackData.assessment.correctness_percentage) / 
          (prev.completed + 1)
        )
      }));
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setIsProcessingAnswer(true);
    setFeedback(null);
  };

  const handleSkipQuestion = () => {
    setAnswer('');
    setFeedback(null);
    setCurrentQuestion(null);
    setIsProcessingAnswer(false);
  };

  const handleRetry = () => {
    setFeedback(null);
    setIsProcessingAnswer(false);
  };

  const handleNextQuestion = () => {
    // First clear all states
    setAnswer('');
    setFeedback(null);
    setCurrentQuestion(null);
    setIsProcessingAnswer(false);

    // Then generate new question after a small delay
    setTimeout(() => {
      if (ref.current) {
        ref.current.generateQuestion();
      }
    }, 100);
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      gap: 3,
      overflow: 'auto',
      pb: 3,
      direction: 'rtl',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
    }}>
      <QuestionDisplay
        ref={ref}
        selectedSubject={selectedSubject}
        selectedExam={selectedExam}
        selectedTopic={selectedTopic}
        selectedSubtopic={selectedSubtopic}
        selectedTopics={selectedTopics}
        selectedSubtopics={selectedSubtopics}
        onQuestionGenerated={handleQuestionGenerated}
        onSkipQuestion={handleSkipQuestion}
      />
      {selectedExam && currentQuestion && (
        <AnswerSection 
          answer={answer} 
          setAnswer={setAnswer}
          question={currentQuestion}
          onFeedback={handleFeedbackReceived}
          onSubmit={handleAnswerSubmit}
          disabled={isProcessingAnswer || feedback !== null}
        />
      )}
      {(isProcessingAnswer || feedback) && (
        <FeedbackSection 
          feedback={feedback || {
            analysis: {
              correct_parts: '',
              mistakes: '',
              guidance: ''
            },
            assessment: {
              correctness_percentage: 0
            }
          }}
          question={currentQuestion}
          isProcessing={isProcessingAnswer}
          onNextQuestion={handleNextQuestion}
          onRetry={handleRetry}
        />
      )}
    </Box>
  );
});

CenterPanel.displayName = 'CenterPanel';

export default CenterPanel; 