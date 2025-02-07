import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Avatar, FormGroup, Checkbox, Chip, Menu, ListItemText, Divider } from '@mui/material';
import subjectsData from '../data/subjects.json';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PolylineIcon from '@mui/icons-material/Polyline';

function TopPanel({
  selectedSubject,
  setSelectedSubject,
  selectedExam,
  setSelectedExam,
  selectedTopic,
  setSelectedTopic,
  selectedSubtopic,
  setSelectedSubtopic,
  selectedTopics,
  setSelectedTopics,
  selectedSubtopics,
  setSelectedSubtopics,
  progress,
}) {
  const [topicsAnchorEl, setTopicsAnchorEl] = useState(null);
  const [subtopicsAnchorEl, setSubtopicsAnchorEl] = useState(null);
  
  const currentSubject = selectedSubject;
  const currentExam = selectedExam;
  const currentTopic = selectedTopic;
  
  useEffect(() => {
    if (selectedExam && currentExam) {
      setSelectedTopics([]);
      setSelectedSubtopics([]);
    } else {
      setSelectedTopics([]);
      setSelectedSubtopics([]);
    }
  }, [selectedExam, currentExam]);

  const handleSubjectChange = (event) => {
    const subject = subjectsData.subjects.find(s => s.id === event.target.value);
    setSelectedSubject(subject);
    setSelectedExam(null);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleExamChange = (event) => {
    const exam = currentSubject?.exams.find(e => e.id === event.target.value);
    setSelectedExam(exam);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleTopicChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedTopics(selectedValues);
    
    if (selectedValues.length === 0) {
      setSelectedTopic(null);
    } else {
      if (selectedValues.length === 1) {
        const topic = currentExam?.topics.find(t => t.id === selectedValues[0]);
        setSelectedTopic(topic);
      } else {
        setSelectedTopic(null);
      }
    }
    
    setSelectedSubtopic(null);
    setSelectedSubtopics([]);
  };

  const handleSubtopicChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedSubtopics(selectedValues);
    
    if (selectedValues.length === 0) {
      setSelectedSubtopic(null);
    } else {
      if (selectedValues.length === 1) {
        const subtopic = currentTopic?.subtopics.find(st => st.id === selectedValues[0]);
        setSelectedSubtopic(subtopic);
      } else {
        setSelectedSubtopic(null);
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      width: '100%',
      bgcolor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: '0 0 8px 8px',
    }}>
      {/* Top row - Platform name and Student greeting */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        px: 3,  // Increased horizontal padding
        pt: 2,
        justifyContent: 'space-between',
        bgcolor: 'white',  // White background for top section
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {/* Right side - Platform name and slogan */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          order: 1
        }}>
          <Box sx={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,  // Increased to match Avatar size
            height: 40  // Increased to match Avatar size
          }}>
            <PolylineIcon sx={{ 
              color: '#ff9800',
              fontSize: 40,  // Increased size
              transform: 'rotate(135deg) scale(1.2)',
              position: 'absolute',
              opacity: 0.9,
              '& path': {
                strokeWidth: '1.5px'
              }
            }} />
            <PolylineIcon sx={{ 
              color: 'primary.main',
              fontSize: 35,  // Increased size
              transform: 'rotate(135deg) scale(1)',
              position: 'relative',
              zIndex: 1,
              '& path': {
                strokeWidth: '1.5px'
              }
            }} />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                lineHeight: 1.2,
                color: 'primary.main',
                fontSize: '1.25rem'  // Match user greeting size
              }}
            >
              איזיפס
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#ff9800',
                fontWeight: 500,
                fontSize: '0.75rem'  // Adjusted for proportion
              }}
            >
              פשוט להצליח
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, order: 2 }} />

        {/* Left side - Student info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          order: 3
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            width: 28,  // Reduced from 32
            height: 28, // Reduced from 32
          }}>
            <AccountCircleIcon sx={{ 
              fontSize: 18  // Reduced from 20
            }} />
          </Avatar>
          <Typography 
            variant="subtitle1"  // Changed from h6 to subtitle1
            sx={{ 
              fontSize: '0.9rem'  // Explicitly set smaller font size
            }}
          >
            שלום, ישראל ישראלי
          </Typography>
        </Box>
      </Box>

      {/* Middle row - Selectors */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        px: 3,
        py: 2,
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {/* Subject selector (rightmost) */}
        <FormControl sx={{ minWidth: 220, order: 1 }}>
          <InputLabel>מקצוע</InputLabel>
          <Select
            value={selectedSubject?.id || ''}
            onChange={handleSubjectChange}
            label="מקצוע"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                textAlign: 'right',
              },
              '& .MuiSelect-select': {
                textAlign: 'right',
              }
            }}
          >
            {subjectsData.subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Exam selector */}
        <FormControl sx={{ minWidth: 220, order: 2 }}>
          <InputLabel>בחינה</InputLabel>
          <Select
            value={selectedExam?.id || ''}
            onChange={handleExamChange}
            label="בחינה"
            disabled={!selectedSubject}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                textAlign: 'right',
              },
              '& .MuiSelect-select': {
                textAlign: 'right',
              }
            }}
          >
            {currentSubject?.exams.map((exam) => (
              <MenuItem key={exam.id} value={exam.id}>
                {exam.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Topic selector */}
        {currentExam && (
          <FormControl sx={{ minWidth: 300, order: 3 }}>
            <InputLabel>נושאים</InputLabel>
            <Select
              multiple
              value={selectedTopics}
              onChange={handleTopicChange}
              label="נושאים"
              renderValue={(selected) => {
                if (selected.length === 0) return "כל הנושאים";
                if (currentExam?.topics?.length === selected.length) return "כל הנושאים";
                return currentExam?.topics
                  .filter(t => selected.includes(t.id))
                  .map(t => t.name)
                  .join(', ');
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  textAlign: 'right',
                },
                '& .MuiSelect-select': {
                  textAlign: 'right',
                }
              }}
            >
              {currentExam?.topics?.map((topic) => (
                <MenuItem 
                  key={topic.id}
                  value={topic.id}
                  sx={{ py: 0.5 }}
                >
                  <Checkbox 
                    checked={selectedTopics.includes(topic.id)}
                    sx={{ mr: 1 }}
                  />
                  <ListItemText 
                    primary={topic.name}
                    primaryTypographyProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Subtopic selector */}
        {selectedTopics.length > 0 && (
          <FormControl sx={{ minWidth: 300, order: 4 }}>
            <InputLabel>תתי-נושאים</InputLabel>
            <Select
              multiple
              value={selectedSubtopics}
              onChange={handleSubtopicChange}
              label="תתי-נושאים"
              renderValue={(selected) => {
                const allSubtopics = selectedTopics.flatMap(topicId => {
                  const topic = currentExam?.topics.find(t => t.id === topicId);
                  return topic?.subtopics || [];
                });
                if (selected.length === 0) return "כל תתי-הנושאים";
                if (allSubtopics.length === selected.length) return "כל תתי-הנושאים";
                return allSubtopics
                  .filter(st => selected.includes(st.id))
                  .map(st => st.name)
                  .join(', ');
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  textAlign: 'right',
                },
                '& .MuiSelect-select': {
                  textAlign: 'right',
                }
              }}
            >
              {selectedTopics.flatMap(topicId => {
                const topic = currentExam?.topics.find(t => t.id === topicId);
                return topic?.subtopics || [];
              }).map((subtopic) => (
                <MenuItem 
                  key={subtopic.id}
                  value={subtopic.id}
                  sx={{ py: 0.5 }}
                >
                  <Checkbox 
                    checked={selectedSubtopics.includes(subtopic.id)}
                    sx={{ mr: 1 }}
                  />
                  <ListItemText 
                    primary={subtopic.name}
                    primaryTypographyProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Bottom row - Progress and Analytics */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        px: 3,  // Increased horizontal padding
        pb: 2,
        direction: 'rtl',
        bgcolor: 'white',  // White background for progress
      }}>
        {progress && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 3,
            p: 1.5,
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: '#f0f2f5',  // Subtle hover effect
              transition: 'background-color 0.2s'
            }
          }}>
            {/* Progress Stats */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 4,
              borderLeft: '1px solid',
              borderColor: 'divider',
              pl: 4,
              pr: 2
            }}>
              {/* Completed Questions */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1 
              }}>
                <Box sx={{
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Typography variant="subtitle2">
                    {progress.completed}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  שאלות הושלמו
                </Typography>
              </Box>

              {/* Success Rate */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{
                  bgcolor: progress.successRate >= 70 ? 'success.main' : 'warning.main',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Typography variant="subtitle2">
                    {progress.successRate}%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  אחוז הצלחה
                </Typography>
              </Box>
            </Box>

            {/* Weak Topics Section */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                נושאים לחיזוק:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                flexWrap: 'wrap',
                flex: 1
              }}>
                {progress.weakTopics?.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic.name}
                    size="small"
                    color="warning"
                    sx={{ 
                      '& .MuiChip-label': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                ))}
                {!progress.weakTopics?.length && (
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                    אין נושאים לחיזוק כרגע
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TopPanel; 