import { useState } from 'react';
import { 
  Modal, 
  Progress, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Table, 
  Badge, 
  Alert,
  Tag,
  Tooltip,
  ConfigProvider,
  Button,
  Collapse as AntCollapse,
  Statistic,
  Divider,
  Slider,
  DatePicker,
  Popover
} from 'antd';
import { 
  WarningOutlined, 
  InfoCircleOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UpOutlined,
  DownOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  CloseOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/he'; // For Hebrew date format

const { Title, Text } = Typography;

function ProgressDialog({ isOpen, onClose, progressData }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    alerts: false,
    topics: false
  });
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [targetScore, setTargetScore] = useState(70);  // Default to 70%
  const [examDate, setExamDate] = useState(dayjs().add(1, 'month'));  // Default to one month from today
  const [targetScorePopoverOpen, setTargetScorePopoverOpen] = useState(false);

  // Add CSS for animations
  const styles = {
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    card: {
      animation: 'fadeIn 0.3s ease-out',
      transition: 'all 0.3s ease'
    }
  };

  const topics = [
    { topic: 'ציוד מגן אישי', completed: 8, successRate: 45, minRequired: 30, status: 'red' },
    { topic: 'חפירות ועבודות עפר', completed: 6, successRate: 50, minRequired: 30, status: 'red' },
    { topic: 'מקום מוקף', completed: 12, successRate: 52, minRequired: 30, status: 'red' },
    { topic: 'גיהות', completed: 15, successRate: 55, minRequired: 30, status: 'red' },
    { topic: 'ביטומן חם ואש', completed: 10, successRate: 58, minRequired: 30, status: 'red' },
    { topic: 'חשמל', completed: 9, successRate: 65, minRequired: 30, status: 'orange' },
    { topic: 'טפסות', completed: 12, successRate: 68, minRequired: 30, status: 'orange' },
    { topic: 'סולמות', completed: 15, successRate: 72, minRequired: 30, status: 'orange' },
    { topic: 'גגות שבירים ותלולים', completed: 18, successRate: 75, minRequired: 30, status: 'orange' },
    { topic: 'ריתוך וחיתוך להבה', completed: 32, successRate: 62, minRequired: 30, status: 'white' },
    { topic: 'בניה טרומית', completed: 35, successRate: 64, minRequired: 30, status: 'white' },
    { topic: 'הקמת מבנה מתכת', completed: 33, successRate: 66, minRequired: 30, status: 'white' },
    { topic: 'מכונות ואביזרי הרמה', completed: 31, successRate: 68, minRequired: 30, status: 'white' },
    { topic: 'עגורנים', completed: 32, successRate: 70, minRequired: 30, status: 'green' },
    { topic: 'פיגומים', completed: 35, successRate: 75, minRequired: 30, status: 'green' },
    { topic: 'הריסה וחומרי פיצוץ', completed: 38, successRate: 78, minRequired: 30, status: 'green' },
    { topic: 'עבודה בגובה', completed: 45, successRate: 80, minRequired: 30, status: 'green' }
  ];

  // Define consistent colors
  const colors = {
    error: {
      bg: '#ffebee',
      border: '#ffcdd2',
      text: '#d32f2f'
    },
    warning: {
      bg: '#fff3e0',
      border: '#ffe0b2',
      text: '#ed6c02'
    },
    success: {
      bg: '#e8f5e9',
      border: '#c8e6c9',
      text: '#2e7d32'
    },
    default: {
      bg: '#f5f5f5',
      border: '#eeeeee',
      text: '#757575'
    }
  };

  // Calculate recommended questions based on target score
  const getRecommendedQuestions = (target) => {
    // Map target scores to recommended questions
    const targetMap = {
      70: 500,
      80: 800,
      90: 1400,
      95: 2000
    };
    return targetMap[target] || 800;  // Default to 800 if target not in map
  };

  // Calculate required hours based on target score
  const getRequiredHours = (target) => {
    // Map target scores to required hours
    const hoursMap = {
      70: '20-25',
      80: '30-35',
      90: '45-50',
      95: '60-65'
    };
    return hoursMap[target] || '30-35';  // Default to 30-35 if target not in map
  };

  // Update row classification based on target score
  const getRowClassName = (record) => {
    // Red: Success rate lower than 55% (unchanged)
    if (record.successRate < 55) return 'error-row';
    
    // Orange: Missing questions OR success rate between 55% and target-1%
    if (record.completed < record.minRequired || 
        (record.successRate >= 55 && record.successRate < targetScore)) {
      return 'warning-row';
    }
    
    // Green: Not missing questions AND success rate >= target
    if (record.completed >= record.minRequired && record.successRate >= targetScore) {
      return 'success-row';
    }

    return 'default-row';
  };

  // Update grouping logic based on target score
  const groupedTopics = {
    error: topics.filter(t => t.successRate < 55),
    warningQuestions: topics.filter(t => 
      t.completed < t.minRequired && t.successRate >= 55
    ),
    warningScore: topics.filter(t => 
      t.completed >= t.minRequired && 
      t.successRate >= 55 && 
      t.successRate < targetScore
    ),
    success: topics.filter(t => 
      t.completed >= t.minRequired && 
      t.successRate >= targetScore
    ),
    default: []
  };

  // Format topics for alert display (for success and error cases)
  const formatTopics = (topicList) => {
    return topicList.map(t => `${t.topic} (${t.successRate}%)`).join(', ');
  };

  // Format topics with missing questions count (for warning cases)
  const formatTopicsWithMissing = (topicList) => {
    return topicList.map(t => {
      const missing = t.minRequired - t.completed;
      return `${t.topic} (חסרות ${missing} שאלות)`;
    }).join(', ');
  };

  // Topic detail modal
  const showTopicDetail = (topic) => {
    Modal.info({
      title: (
        <Text strong style={{ fontSize: '1.2rem' }}>
          {topic.topic}
        </Text>
      ),
      icon: null,
      width: 500,
      content: (
        <Space direction="vertical" size="large" style={{ width: '100%', padding: '20px 0' }}>
          <Progress 
            percent={topic.successRate} 
            status="active"
            strokeColor={{
              '0%': topic.successRate < 50 ? '#ff4d4f' : 
                     topic.successRate < 70 ? '#faad14' : '#52c41a',
              '100%': topic.successRate < 50 ? '#ff7875' : 
                      topic.successRate < 70 ? '#ffd666' : '#95de64'
            }}
          />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="שאלות שהושלמו"
                  value={`${topic.completed}/${topic.minRequired}`}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="זמן ממוצע לשאלה"
                  value="2.5"
                  suffix="דקות"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card size="small" title="מגמת התקדמות">
            {/* Simple line chart showing progress */}
            <TinyLineChart 
              data={[30, 45, 52, topic.successRate]} 
              color={topic.successRate < 50 ? '#ff4d4f' : 
                     topic.successRate < 70 ? '#faad14' : '#52c41a'}
            />
          </Card>

          <Alert
            message="המלצה"
            description={
              topic.successRate < 50 ? "מומלץ לחזור על החומר התיאורטי ולתרגל שאלות נוספות" :
              topic.successRate < 70 ? "נדרש תרגול נוסף לשיפור הביצועים" :
              "המשך כך! אתה בדרך הנכונה"
            }
            type={topic.successRate < 50 ? "error" : 
                  topic.successRate < 70 ? "warning" : "success"}
            showIcon
          />
        </Space>
      ),
      okText: "סגור",
      className: "topic-detail-modal"
    });
  };

  // Simplified table columns
  const columns = [
    {
      title: 'נושא',
      dataIndex: 'topic',
      key: 'topic',
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'שאלות שנוסו',
      dataIndex: 'completed',
      key: 'completed',
      align: 'center',
      render: (completed) => <Text>{completed}</Text>
    },
    {
      title: 'נדרשות נוספות',
      key: 'required',
      align: 'center',
      render: (_, record) => {
        const remaining = Math.max(0, record.minRequired - record.completed);
        return <Text>{remaining}</Text>;
      }
    },
    {
      title: 'אחוז הצלחה',
      dataIndex: 'successRate',
      key: 'successRate',
      align: 'center',
      render: (rate) => <Text>{rate}%</Text>
    }
  ];

  const getStatusColor = (percent) => {
    if (percent < 50) return { '0%': '#ff4d4f', '100%': '#ff7875' };  // Red
    if (percent < 70) return { '0%': '#faad14', '100%': '#ffc107' };  // Orange
    return { '0%': '#52c41a', '100%': '#95de64' };                    // Green
  };

  // Calculate coverage percentage based on target score
  const getCoveragePercent = (target) => {
    const recommended = getRecommendedQuestions(target);
    return Math.round((170 / recommended) * 100);  // 170 is completed questions
  };

  // Calculate study hours per day/week based on exam date and target score
  const getStudyPlan = () => {
    if (!examDate) return null;

    const totalHours = parseInt(getRequiredHours(targetScore).split('-')[0]); // Take minimum hours
    const daysUntilExam = examDate.diff(dayjs(), 'day');
    
    if (daysUntilExam <= 0) return null;

    const hoursPerDay = Math.round((totalHours / daysUntilExam) * 10) / 10;
    const hoursPerWeek = Math.round(hoursPerDay * 7);

    return {
      hoursPerDay,
      hoursPerWeek
    };
  };

  // Create the target score slider content
  const targetScoreContent = (
    <Space direction="vertical" size={8} style={{ width: 200 }}>
      <Slider
        min={70}
        max={95}
        step={null}
        value={targetScore}
        onChange={(value) => {
          setTargetScore(value);
          setTargetScorePopoverOpen(false);  // Close popover after selection
        }}
        marks={{
          70: '70%',
          80: '80%',
          90: '90%',
          95: '95%'
        }}
        tooltip={{
          formatter: (value) => `${value}%`
        }}
      />
    </Space>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1976d2',
          borderRadius: 8,  // Increased for better modern look
          fontFamily: 'Rubik, Arial, sans-serif',
          colorBgContainer: '#ffffff',
          colorBorder: 'rgba(0, 0, 0, 0.12)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',  // Better shadow
          fontSize: 14,
          padding: 24,
        },
        components: {
          Modal: {
            padding: 0,
            borderRadiusLG: 12,  // Rounder corners for modal
          },
          Card: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',  // Subtle card shadows
          },
          Alert: {
            borderRadiusLG: 8,
            paddingContentHorizontal: 16,
            paddingContentVertical: 12,
          },
          Table: {
            colorBgContainer: 'transparent',
            rowHoverBg: 'transparent',
            headerBg: '#f8f9fa',
          }
        }
      }}
    >
      <style>
        {`
          .topics-table .ant-table-thead > tr > th {
            padding: 8px 16px !important;  /* Reduced header padding */
            font-size: 0.95rem;
          }
          .topics-table .ant-table-tbody > tr > td {
            padding: 4px 16px !important;  /* Reduced cell padding */
            font-size: 0.9rem;
          }
          .topics-table .error-row td {
            background-color: #ffebee !important;
          }
          .topics-table .warning-row td {
            background-color: #fff3e0 !important;
          }
          .topics-table .success-row td {
            background-color: #e8f5e9 !important;
          }
          .topics-table .default-row td {
            background-color: #f5f5f5 !important;
          }
          .topics-table tbody tr:hover td {
            background-color: inherit !important;
          }
        `}
      </style>
      <Modal
        open={isOpen}
        onCancel={onClose}
        destroyOnClose
        closable={true}
        maskClosable={true}
        keyboard={true}
        width={1000}
        centered
        footer={null}  // Remove footer completely
        closeIcon={<CloseOutlined style={{ fontSize: '20px' }} />}
        style={{ 
          direction: 'rtl',
          top: 20
        }}
        bodyStyle={{ 
          padding: '24px',
          background: '#f8f9fa',
          borderRadius: '0 0 12px 12px'
        }}
        modalRender={(modal) => (
          <div onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}>
            {modal}
          </div>
        )}
      >
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* Compact User Input Section */}
          <Card 
            bordered={false} 
            bodyStyle={{ padding: '16px' }}
            style={{ marginBottom: 16 }}  // Reduced margin
          >
            <Row gutter={32} align="middle" justify="center">
              <Col>
                <Space direction="vertical" size={4} align="center">
                  <Text strong style={{ fontSize: '1.1rem' }}>
                    ציון יעד
                  </Text>
                  <Popover
                    content={targetScoreContent}
                    trigger="click"
                    open={targetScorePopoverOpen}
                    onOpenChange={setTargetScorePopoverOpen}
                    placement="bottom"
                  >
                    <div style={{ cursor: 'pointer' }}>  {/* Wrap Progress in clickable div */}
                      <Progress
                        type="circle"
                        percent={targetScore}
                        width={90}
                        strokeColor="#8c8c8c"
                        strokeWidth={6}
                        format={(percent) => (
                          <div>
                            <Text style={{ 
                              fontSize: '1.4rem', 
                              fontWeight: 600,
                              color: 'rgba(0, 0, 0, 0.85)'
                            }}>
                              {percent}%
                            </Text>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#8c8c8c',
                              marginTop: -4
                            }}>
                              לחץ לשינוי
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </Popover>
                </Space>
              </Col>
              <Col>
                <Space direction="vertical" size={4} align="center">
                  <Text strong style={{ fontSize: '1.1rem' }}>
                    תאריך מבחן
                  </Text>
                  <DatePicker
                    placeholder="בחר תאריך"
                    format="DD/MM/YYYY"
                    locale="he"
                    value={examDate}
                    onChange={setExamDate}
                    disabledDate={date => date.isBefore(dayjs(), 'day')}
                    style={{ 
                      width: '130px',  // Slightly smaller
                      height: '32px',  // Smaller height
                      fontSize: '1rem'
                    }}
                  />
                </Space>
              </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 12 }}>  {/* Reduced margin */}
              <Text type="secondary" style={{ fontSize: '0.9rem' }}>  {/* Smaller text */}
                הגדר את היעדים שלך - הנתונים למטה יתעדכנו בהתאם
              </Text>
            </Row>
          </Card>

          {/* Main Metrics Grid */}
          <Card bordered={false}>
            <Row gutter={[24, 24]}>
              {/* First Row - Current Status */}
              <Col span={12}>
                <Card 
                  size="small"
                  style={{ height: '100%', background: '#f8f9fa' }}
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space>
                      <TrophyOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
                      <Text strong>ציון נוכחי</Text>
                    </Space>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text style={{ fontSize: '2.2rem', fontWeight: 600, color: '#1976d2' }}>
                          56%
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.9rem', display: 'block' }}>
                          על בסיס התרגול עד כה
                        </Text>
                      </Col>
                      <Col>
                        <Progress 
                          type="circle" 
                          percent={56}
                          width={80}
                          strokeColor={getStatusColor(56)}
                          strokeWidth={8}
                        />
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card 
                  size="small"
                  style={{ height: '100%', background: '#f8f9fa' }}
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space>
                      <CheckCircleOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
                      <Text strong>כיסוי שאלות</Text>
                    </Space>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text style={{ fontSize: '2.2rem', fontWeight: 600, color: '#1976d2' }}>
                          {getCoveragePercent(targetScore)}%
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.9rem', display: 'block' }}>
                          170 מתוך {getRecommendedQuestions(targetScore)} שאלות
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                          (סה"כ במאגר: 2,200)
                        </Text>
                      </Col>
                      <Col>
                        <Progress 
                          type="circle" 
                          percent={getCoveragePercent(targetScore)}
                          width={80}
                          strokeColor={getStatusColor(getCoveragePercent(targetScore))}
                          strokeWidth={8}
                        />
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>

              {/* Second Row - Time Stats */}
              <Col span={12}>
                <Card 
                  size="small"
                  style={{ height: '100%', background: '#f8f9fa' }}
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space>
                      <FieldTimeOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
                      <Text strong>זמני תרגול</Text>
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text type="secondary">עד כה</Text>
                        <Text style={{ fontSize: '1.6rem', fontWeight: 600, display: 'block', color: '#1976d2' }}>
                          13 שעות
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">נדרש להשלים</Text>
                        <Text style={{ fontSize: '1.6rem', fontWeight: 600, display: 'block', color: '#ed6c02' }}>
                          {getRequiredHours(targetScore)} שעות
                        </Text>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card 
                  size="small"
                  style={{ height: '100%', background: '#f8f9fa' }}
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space>
                      <CalendarOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
                      <Text strong>קצב למידה נדרש</Text>
                    </Space>
                    {examDate && getStudyPlan() ? (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Text type="secondary">ליום</Text>
                          <Text style={{ fontSize: '1.6rem', fontWeight: 600, display: 'block', color: '#1976d2' }}>
                            {getStudyPlan().hoursPerDay}
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">לשבוע</Text>
                          <Text style={{ fontSize: '1.6rem', fontWeight: 600, display: 'block', color: '#1976d2' }}>
                            {getStudyPlan().hoursPerWeek}
                          </Text>
                        </Col>
                      </Row>
                    ) : (
                      <Text type="secondary">יש להגדיר תאריך מבחן</Text>
                    )}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Updated Alerts */}
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {groupedTopics.error.length > 0 && (
              <Alert
                type="error"
                icon={<WarningOutlined style={{ fontSize: 20 }} />}
                message={
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '1.1rem' }}>
                      נדרש שיפור בסיסי (מומלץ לצפות בהרצאות לפני המשך תרגול)
                    </Text>
                    <Space direction="vertical" size={4} style={{ 
                      opacity: 0.85,
                      fontSize: '1rem',
                      lineHeight: 1.5
                    }}>
                      <Text>{formatTopics(groupedTopics.error)}</Text>
                    </Space>
                  </Space>
                }
                style={{ 
                  border: 'none',
                  borderRadius: 8,
                  background: colors.error.bg
                }}
              />
            )}

            {groupedTopics.warningQuestions.length > 0 && (
              <Alert
                type="warning"
                icon={<InfoCircleOutlined style={{ fontSize: 20 }} />}
                message={
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '1.1rem' }}>
                      לא תורגלו מספיק שאלות
                    </Text>
                    <Text style={{ 
                      opacity: 0.85,
                      fontSize: '1rem',
                      lineHeight: 1.5
                    }}>
                      {formatTopicsWithMissing(groupedTopics.warningQuestions)}
                    </Text>
                  </Space>
                }
                style={{ 
                  border: 'none',
                  borderRadius: 8,
                  background: colors.warning.bg
                }}
              />
            )}

            {groupedTopics.warningScore.length > 0 && (
              <Alert
                type="warning"
                icon={<InfoCircleOutlined style={{ fontSize: 20 }} />}
                message={
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '1.1rem' }}>
                      מומלץ לתרגל עוד כדי להשתפר
                    </Text>
                    <Text style={{ 
                      opacity: 0.85,
                      fontSize: '1rem',
                      lineHeight: 1.5
                    }}>
                      {formatTopics(groupedTopics.warningScore)}
                    </Text>
                  </Space>
                }
                style={{ 
                  border: 'none',
                  borderRadius: 8,
                  background: colors.warning.bg
                }}
              />
            )}

            {groupedTopics.success.length > 0 && (
              <Alert
                type="success"
                icon={<CheckCircleOutlined style={{ fontSize: 20 }} />}
                message={
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '1.1rem' }}>
                      מוכנות טובה
                    </Text>
                    <Text style={{ 
                      opacity: 0.85,
                      fontSize: '1rem',
                      lineHeight: 1.5
                    }}>
                      {formatTopics(groupedTopics.success)}
                    </Text>
                  </Space>
                }
                style={{ 
                  border: 'none',
                  borderRadius: 8,
                  background: colors.success.bg
                }}
              />
            )}
          </Space>

          {/* Enhanced Topics Table */}
          <Card bodyStyle={{ padding: '12px' }}>  {/* Reduced card padding */}
            <Table 
              columns={columns} 
              dataSource={topics}
              size="small"  // Add this to make the table more compact
              pagination={false}
              rowKey="topic"
              rowClassName={getRowClassName}
              className="topics-table"
              style={{
                '& .ant-table-thead > tr > th': {
                  background: '#f8f9fa',
                  fontWeight: 600
                }
              }}
            />
          </Card>
        </Space>
      </Modal>
    </ConfigProvider>
  );
}

// Helper component for tiny charts
function TinyLineChart({ data, height = 30, width = 80, color }) {
  // Simple SVG line chart
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (width / (data.length - 1)) * index;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ProgressDialog; 