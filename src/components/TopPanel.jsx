import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Avatar, FormGroup, Checkbox, Chip, Menu, ListItemText, Divider, LinearProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Grid, Tooltip } from '@mui/material';
import subjectsData from '../data/subjects.json';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PolylineIcon from '@mui/icons-material/Polyline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import TuneIcon from '@mui/icons-material/Tune';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InfoIcon from '@mui/icons-material/Info';
import ProgressDialog from './ProgressDialog';
import { BarChartOutlined, TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Modal, Select as AntSelect, Form } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
const { Option } = AntSelect;

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
  onGenerateQuestion,
  chatMessages,
  handleNewMessage,
  openDialog,
  setOpenDialog,
}) {
  const [topicsAnchorEl, setTopicsAnchorEl] = useState(null);
  const [subtopicsAnchorEl, setSubtopicsAnchorEl] = useState(null);
  const [tempExam, setTempExam] = useState(null);
  const [tempTopics, setTempTopics] = useState([]);
  const [tempSubtopics, setTempSubtopics] = useState([]);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [subtopicsOpen, setSubtopicsOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [targetScore, setTargetScore] = useState(70);
  const [examMonth, setExamMonth] = useState(1);
  const [examDate, setExamDate] = useState(dayjs().add(2, 'week'));  // Default to 2 weeks from now
  
  const currentSubject = selectedSubject;
  const currentExam = selectedExam;
  const currentTopic = selectedTopic;
  
  // Add state for form validation
  const [formErrors, setFormErrors] = useState({
    subject: false,
    exam: false,
    targetScore: false,
    examDate: false
  });

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
    const subject = subjectsData.subjects.find(s => s.id === event);
    setSelectedSubject(subject);
    // Reset exam and topics in both temp and selected states
    setSelectedExam(null);
    setTempExam(null);
    setSelectedTopics([]);
    setTempTopics([]);
    setSelectedSubtopics([]);
    setTempSubtopics([]);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleOpenDialog = () => {
    setTempExam(selectedExam);
    setTempTopics(selectedTopics.filter(Boolean));
    setTempSubtopics(selectedSubtopics.filter(Boolean));
    setOpenDialog(true);
  };

  const handleExamChange = (event) => {
    const exam = currentSubject?.exams.find(e => e.id === event.target.value);
    // Reset topics when exam changes
    setTempExam(exam);
    setTempTopics([]);
    setTempSubtopics([]);
  };

  const handleTopicChange = (event) => {
    // Filter out any undefined values
    const selectedValues = event.target.value.filter(Boolean);
    setTempTopics(selectedValues);
  };

  const handleSubtopicChange = (event) => {
    const selectedValues = event.target.value;
    setTempSubtopics(selectedValues);
  };

  const handleDialogClose = () => {
    setTempExam(selectedExam);
    setTempTopics(selectedTopics);
    setTempSubtopics(selectedSubtopics);
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    // Reset errors
    setFormErrors({
      subject: false,
      exam: false,
      targetScore: false,
      examDate: false
    });

    // Check mandatory fields
    const errors = {
      subject: !selectedSubject,
      exam: !tempExam,
      targetScore: !targetScore,
      examDate: !examDate
    };

    // If there are errors, show them and don't proceed
    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return;
    }
    
    // Proceed with existing logic
    const validTopics = tempTopics.filter(Boolean);
    const validSubtopics = tempSubtopics.filter(Boolean);
    
    setSelectedExam(tempExam);
    setSelectedTopics(validTopics);
    setSelectedSubtopics(validSubtopics);
    setOpenDialog(false);

    if (onGenerateQuestion) {
      // Clear existing question/answer/feedback first
      onGenerateQuestion({
        resetState: true,  // Add this flag
        newSelections: {
          exam: tempExam,
          topics: validTopics,
          subtopics: validSubtopics,
          targetScore: targetScore,
          examDate: examDate
        }
      });
    }
  };

  // Add useEffect to reset topics when exam changes
  useEffect(() => {
    if (tempExam?.id !== selectedExam?.id) {
      setTempTopics([]);
      setTempSubtopics([]);
    }
  }, [tempExam]);

  // Add useEffect to reset subtopics when topics change
  useEffect(() => {
    if (tempTopics.length === 0) {
      setTempSubtopics([]);
    }
  }, [tempTopics]);

  return (
    <>
      <Box sx={{ 
        width: '100%',
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: '0 0 8px 8px',
      }}>
        {/* Top row with logo, exam config, and user */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          px: 3,
          pt: 2,
          pb: 2,
          justifyContent: 'space-between',
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          {/* Right side - Logo and Platform name */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
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

          {/* Left side - Exam Config and User Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
            {/* Exam Config Button */}
            <Button
              onClick={handleOpenDialog}
              startIcon={<TuneIcon />}
              variant={selectedExam ? "outlined" : "contained"}
              size="small"
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
                }),
                height: '32px'
              }}
            >
              הגדרות מבחן
            </Button>

            <Divider orientation="vertical" flexItem />

            {/* User Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 28,
                height: 28
              }}>
                <AccountCircleIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography 
                variant="subtitle1"
                sx={{ fontSize: '0.9rem' }}
              >
                שלום, ישראל ישראלי
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Progress Statistics - with bottom margin */}
        {selectedExam && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            py: 1,
            px: 2,
            borderTop: '2px solid',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            bgcolor: '#f5f5f5',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            mb: 2,  // Add margin bottom
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',  // Light bottom border
            '& + *': {  // Add top margin to next sibling
              mt: 1
            }
          }}>
            {/* Progress Dialog Button */}
            <Tooltip title="סטטיסטיקות מפורטות">
              <IconButton 
                onClick={() => setProgressDialogOpen(true)}
                size="small"
                sx={{ 
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease',
                  border: '1px solid',
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  padding: '6px'
                }}
              >
                <BarChartIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>

            {/* Rest of the statistics with reduced text size */}
            <Tooltip title="אחוז הצלחה - יעד/נוכחי">
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ color: '#424242' }}
              >
                <TrophyOutlined style={{ fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  70% / 56%
                </Typography>
              </Stack>
            </Tooltip>

            {/* Questions Coverage */}
            <Tooltip title="כיסוי שאלות">
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ color: '#424242' }}
              >
                <CheckCircleOutlined style={{ fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  170/510
                </Typography>
              </Stack>
            </Tooltip>

            {/* Study Hours */}
            <Tooltip title="שעות תרגול - בוצע/נדרש">
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ color: '#424242' }}
              >
                <ClockCircleOutlined style={{ fontSize: '1.1rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  13/35 ש'
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Selection Dialog */}
      <Modal
        open={openDialog}
        onCancel={handleDialogClose}
        title={
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 600,
            color: '#2c3e50',
            textAlign: 'right',
            direction: 'rtl',
            borderBottom: '2px solid #e0e0e0',
            paddingBottom: '8px'
          }}>
            הגדרת מבחן
          </div>
        }
        width={800}
        footer={[
          <Button 
            key="cancel" 
            onClick={handleDialogClose}
            style={{ 
              marginLeft: 8,
              padding: '6px 24px'
            }}
          >
            ביטול
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleDialogConfirm}
            style={{
              padding: '6px 32px',
              fontSize: '16px'
            }}
          >
            התחל לתרגל
          </Button>
        ]}
      >
        {/* Updated explanation box */}
        <div style={{ 
          marginBottom: 32,
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          direction: 'rtl',
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <InfoIcon style={{ color: '#2c3e50' }} />
          <div style={{ 
            color: '#2c3e50',
            fontSize: '15px',
            lineHeight: '1.6'
          }}>
            הגדר את תכולת המבחן ואת היעדים שלך - כך נוכל להתאים את התרגול בצורה מיטבית ולעקוב אחר ההתקדמות שלך
          </div>
        </div>

        {/* Form with updated sections */}
        <Form layout="vertical">
          {/* Main Exam Selection Section with new header */}
          <div style={{ 
            marginBottom: 32,
            padding: 24,
            backgroundColor: '#fff',
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              marginBottom: 20,
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: 500,
              direction: 'rtl',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <TuneIcon style={{ color: '#2c3e50' }} />
              הגדרת תכולה
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Form.Item 
                label={<span style={{ fontSize: '16px', fontWeight: 500 }}>מקצוע</span>}
                style={{ flex: 1 }}
                validateStatus={formErrors.subject ? 'error' : ''}
                help={formErrors.subject ? 'שדה חובה' : ''}
              >
                <AntSelect
                  size="large"
                  value={selectedSubject?.id}
                  onChange={(value) => {
                    handleSubjectChange(value);
                  }}
                  style={{ width: '100%' }}
                >
                  {subjectsData.subjects.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Option>
                  ))}
                </AntSelect>
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontSize: '16px', fontWeight: 500 }}>בחינה</span>}
                style={{ flex: 1 }}
                validateStatus={formErrors.exam ? 'error' : ''}
                help={formErrors.exam ? 'שדה חובה' : ''}
              >
                <AntSelect
                  size="large"
                  value={tempExam?.id}
                  onChange={(value) => handleExamChange({ target: { value } })}
                  disabled={!selectedSubject}
                  style={{ width: '100%' }}
                >
                  {currentSubject?.exams.map((exam) => (
                    <Option key={exam.id} value={exam.id}>
                      {exam.name}
                    </Option>
                  ))}
                </AntSelect>
              </Form.Item>
            </div>

            {/* Topics and Subtopics with improved visibility */}
            {tempExam && (
              <div>
                <Form.Item 
                  label={<span style={{ fontSize: '16px', fontWeight: 500 }}>נושאים</span>}
                >
                  <AntSelect
                    size="large"
                    mode="multiple"
                    value={tempTopics}
                    onChange={(values) => handleTopicChange({ target: { value: values } })}
                    style={{ width: '100%' }}
                    placeholder="בחר נושאים לתרגול"
                  >
                    {tempExam?.topics?.map((topic) => (
                      <Option key={topic.id} value={topic.id}>
                        {topic.name}
                      </Option>
                    ))}
                  </AntSelect>
                </Form.Item>

                {tempTopics.length > 0 && (() => {
                  const availableSubtopics = tempTopics.flatMap(topicId => {
                    const topic = tempExam?.topics.find(t => t.id === topicId);
                    return topic?.subtopics || [];
                  });
                  
                  return availableSubtopics.length > 0 ? (
                    <Form.Item 
                      label={<span style={{ fontSize: '16px', fontWeight: 500 }}>תתי-נושאים</span>}
                    >
                      <AntSelect
                        size="large"
                        mode="multiple"
                        value={tempSubtopics}
                        onChange={(values) => handleSubtopicChange({ target: { value: values } })}
                        style={{ width: '100%' }}
                        placeholder="בחר תתי-נושאים לדיוק נוסף"
                      >
                        {availableSubtopics.map((subtopic) => (
                          <Option key={subtopic.id} value={subtopic.id}>
                            {subtopic.name}
                          </Option>
                        ))}
                      </AntSelect>
                    </Form.Item>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Updated target score options */}
          <div style={{ 
            padding: 24,
            backgroundColor: '#FAFAFA',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ 
              marginBottom: 20,
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: 500,
              direction: 'rtl',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <TrendingUpIcon style={{ color: '#2c3e50' }} />
              הגדרת יעדים
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item 
                label={<span style={{ fontSize: '16px', fontWeight: 500 }}>ציון יעד</span>}
                style={{ flex: 1, marginBottom: 0 }}
                validateStatus={formErrors.targetScore ? 'error' : ''}
                help={formErrors.targetScore ? 'שדה חובה' : ''}
              >
                <AntSelect
                  size="large"
                  value={targetScore || 70}
                  onChange={(value) => setTargetScore(value)}
                  style={{ width: '100%' }}
                >
                  {[70, 80, 90, 95].map((score) => (
                    <Option key={score} value={score}>
                      {score}%
                    </Option>
                  ))}
                </AntSelect>
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontSize: '16px', fontWeight: 500 }}>תאריך מבחן</span>}
                style={{ flex: 1, marginBottom: 0 }}
                validateStatus={formErrors.examDate ? 'error' : ''}
                help={formErrors.examDate ? 'שדה חובה' : ''}
              >
                <DatePicker
                  size="large"
                  value={examDate}
                  onChange={setExamDate}
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  placeholder="בחר תאריך"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>

      <ProgressDialog 
        isOpen={progressDialogOpen}
        onClose={() => setProgressDialogOpen(false)}
        progressData={{
          completed: 170,
          total: 510,
          successRate: 65,
          hoursCompleted: 14,
          topics: [
            { topic: 'ציוד מגן אישי', completed: 8, successRate: 45, minRequired: 30 },
            { topic: 'חפירות ועבודות עפר', completed: 6, successRate: 50, minRequired: 30 },
            { topic: 'מקום מוקף', completed: 12, successRate: 52, minRequired: 30 }
          ]
        }}
      />
    </>
  );
}

export default TopPanel; 