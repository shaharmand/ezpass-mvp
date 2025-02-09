import React, { forwardRef, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import QuestionDisplay from './QuestionDisplay';
import AnswerSection from './AnswerSection';
import FeedbackSection from './FeedbackSection';
import { useState } from 'react';
import QuizIcon from '@mui/icons-material/Quiz';

// Separate the question generation logic
const generateNewQuestion = (ref) => {
  if (ref.current) {
    ref.current.generateQuestion();
  }
};

const CenterPanel = forwardRef(({ 
  setProgress,
  selectedSubject,
  selectedExam,
  selectedTopic,
  selectedSubtopic,
  selectedTopics,
  selectedSubtopics,
  onQuestionGenerated,
  onSkipQuestion,
  onSendMessage,
  onExamChange,
  sx 
}, ref) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  
  // Create a separate ref for QuestionDisplay
  const questionDisplayRef = useRef(null);

  const handleQuestionGenerated = (question) => {
    setCurrentQuestion(question);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setIsProcessingFeedback(false);
    if (onQuestionGenerated) {
      onQuestionGenerated(question);
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setIsProcessingFeedback(true);
  };

  const handleFeedbackReceived = (feedback) => {
    setCurrentFeedback(feedback);
    setIsProcessingFeedback(false);
    
    // Update progress
    setProgress(prevProgress => ({
      ...prevProgress,
      completed: prevProgress.completed + 1,
      successRate: Math.round((prevProgress.successRate * (prevProgress.completed) + (feedback.assessment.correctness_percentage)) / (prevProgress.completed + 1))
    }));
  };

  const handleNextQuestion = () => {
    resetStates();
    if (questionDisplayRef.current) {
      questionDisplayRef.current.generateQuestion();
    }
  };

  const handleRetry = () => {
    // Only reset feedback states, keep the answer
    setCurrentFeedback(null);
    setIsProcessingFeedback(false);
  };

  const handleSkipQuestion = () => {
    // Reset all states
    setCurrentQuestion(null);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setIsProcessingFeedback(false);
    
    // Generate new question
    if (questionDisplayRef.current) {
      questionDisplayRef.current.generateQuestion();
    }
  };

  // Add useEffect to watch for exam changes
  useEffect(() => {
    // Reset all states when exam changes
    setCurrentQuestion(null);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setIsProcessingFeedback(false);
  }, [selectedExam]);

  const initialText = `
כדי להתחיל לתרגל, הגדר את המבחן שלך בעזרת כפתור "הגדרות מבחן" למעלה 👆
`;

  const resetStates = () => {
    setCurrentQuestion(null);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setIsProcessingFeedback(false);
  };

  // Update the imperative handle to use questionDisplayRef
  React.useImperativeHandle(ref, () => ({
    generateQuestion: (newSelections) => {
      resetStates();
      if (questionDisplayRef.current) {
        questionDisplayRef.current.generateQuestion(newSelections);
      }
    },
    resetStates
  }));

  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {/* Content Area */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <QuestionDisplay
          ref={questionDisplayRef}
          selectedSubject={selectedSubject}
          selectedExam={selectedExam}
          selectedTopic={selectedTopic}
          selectedSubtopic={selectedSubtopic}
          selectedTopics={selectedTopics}
          selectedSubtopics={selectedSubtopics}
          onQuestionGenerated={handleQuestionGenerated}
          onSkipQuestion={handleSkipQuestion}
          onSendMessage={onSendMessage}
        />
        
        {/* Show answer section whenever there's a question */}
        {currentQuestion && (
          <AnswerSection
            answer={currentAnswer}
            setAnswer={setCurrentAnswer}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            onFeedback={handleFeedbackReceived}
            disabled={!!currentFeedback || isProcessingFeedback}
            onSendMessage={onSendMessage}
          />
        )}

        {/* Show feedback when processing or when feedback exists */}
        {(isProcessingFeedback || currentFeedback) && (
          <FeedbackSection
            feedback={currentFeedback}
            question={currentQuestion}
            isProcessing={isProcessingFeedback}
            onNextQuestion={handleNextQuestion}
            onRetry={handleRetry}
          />
        )}
      </Box>
    </Box>
  );
});

export default CenterPanel; 