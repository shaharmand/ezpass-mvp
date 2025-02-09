import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';

const SectionTitle = ({ text, icon: Icon }) => (
  <h3 style={{
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '16px',
    fontFamily: 'Rubik, Arial, sans-serif',
    fontSize: '1rem',
    direction: 'rtl',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <Icon sx={{ color: '#2c3e50', fontSize: '1.25rem' }} />
    {text}
  </h3>
);

const LinkItem = ({ text }) => (
  <a 
    href="#"
    style={{
      display: 'block',
      marginBottom: '12px',
      color: '#1976d2',
      textDecoration: 'none',
      fontFamily: 'Rubik, Arial, sans-serif',
      fontSize: '0.875rem',
      direction: 'rtl',
      textAlign: 'right'
    }}
  >
    • {text}
  </a>
);

const LearningContent = ({ currentQuestion, selectedSubject, selectedExam, selectedTopic, selectedTopics }) => {
  // Helper function to get random item from array
  const getRandomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const getRelevantLinks = () => {
    if (!currentQuestion) {
      return {
        videos: [],
        documents: [],
        links: []
      };
    }

    const subject = selectedSubject?.name || '';
    const exam = selectedExam?.name || '';
    
    // Get topics and translate keys to names
    let topicsToUse = [];
    if (selectedTopics?.length > 0 && selectedExam?.topics) {
      // Create a map of topic ids to their Hebrew names
      const topicMap = {};
      selectedExam.topics.forEach(topic => {
        if (topic.id) {
          topicMap[topic.id] = topic.name;
        }
      });

      // Convert topic keys to names using the map
      topicsToUse = selectedTopics
        .map(topicKey => topicMap[topicKey])
        .filter(Boolean); // Remove any undefined values
    } else if (selectedExam?.topics) {
      // If no specific topics selected, use all exam topic names
      topicsToUse = selectedExam.topics.map(topic => topic.name);
    }

    // Create arrays with all possible links using the topic names
    const allVideos = [
      // General video for exam level
      getRandomItem([
        `שיעור מקיף - ${exam}`,
        `תרגול מודרך - ${exam}`
      ]),
      `טיפים ודגשים - ${exam}`,
      // Topic-specific videos with random types
      ...topicsToUse.map(topicName => getRandomItem([
        `שיעור מקיף - ${topicName}`,
        `תרגול מודרך - ${topicName}`
      ]))
    ];

    const allDocuments = [
      // Always include formula sheet for the specific exam
      `דף נוסחאות - ${exam}`,
      // Random general document types for each topic
      ...topicsToUse.map(topic => getRandomItem([
        `סיכום ממוקד - ${topic}`,
        `מילון מונחים - ${topic}`,
        `מאגר בחינות - ${exam} - ${topic}`
      ])),
      // Additional random documents
      ...topicsToUse.map(topic => getRandomItem([
        `סיכום ממוקד - ${subject} - ${topic}`,
        `מילון מונחים - ${subject} - ${topic}`,
        `מאגר בחינות - ${exam} - ${topic}`
      ]))
    ];

    const allLinks = [
      `מחשבון גרפי אונליין - ${subject}`,
      ...topicsToUse.map(topic => `תרגול אינטראקטיבי - ${topic}`)
    ];

    // Limit each array to maximum 7 items
    return {
      videos: allVideos.filter(Boolean).slice(0, 7),
      documents: allDocuments.filter(Boolean).slice(0, 7),
      links: allLinks.filter(Boolean).slice(0, 7)
    };
  };

  const relevantLinks = getRelevantLinks();

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      {!selectedExam ? (
        <Typography sx={{ color: '#666', textAlign: 'center', mt: 2 }}>
          התחל לתרגל על מנת לראות חומר עזר רלוונטי
        </Typography>
      ) : !currentQuestion ? (
        <Typography sx={{ color: '#666', textAlign: 'center', mt: 2 }}>
          התחל לתרגל על מנת לראות חומר עזר רלוונטי
        </Typography>
      ) : (
        <Box sx={{ 
          p: 2,
          backgroundColor: 'transparent',
          borderRadius: 0,
          boxShadow: 'none'
        }}>
          {/* Videos Section */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle text="סרטוני הסבר" icon={OndemandVideoIcon} />
            {relevantLinks.videos.map((text, index) => (
              <LinkItem key={index} text={text} />
            ))}
          </div>

          <Divider sx={{ my: 3 }} />

          {/* Documents Section */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle text="סיכומים ומסמכים" icon={DescriptionIcon} />
            {relevantLinks.documents.map((text, index) => (
              <LinkItem key={index} text={text} />
            ))}
          </div>

          <Divider sx={{ my: 3 }} />

          {/* External Links Section */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle text="קישורים שימושיים" icon={LinkIcon} />
            {relevantLinks.links.map((text, index) => (
              <LinkItem key={index} text={text} />
            ))}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default LearningContent; 