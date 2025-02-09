// Mock assistance responses
const mockAssistance = {
  questionExplanation: (question) => {
    return {
      type: 'explanation',
      title: 'הסבר השאלה',
      content: `בשאלה זו אנחנו נדרשים להבין:
1. מה בדיוק נדרש למצוא
2. אילו נתונים יש לנו
3. איך להשתמש בנתונים כדי להגיע לפתרון

הדגשים חשובים:
- שים לב לכל המספרים והנתונים שמופיעים בשאלה
- קרא את השאלה שוב וודא שהבנת את כל המונחים
- חשוב על הקשר בין הנתונים השונים`
    };
  },

  solutionGuide: (question) => {
    return {
      type: 'guide',
      title: 'הדרכה לפתרון',
      content: `דרך מומלצת לגשת לפתרון:
1. ארגן את הנתונים בצורה ברורה
2. חשוב על הנוסחאות הרלוונטיות לנושא
3. תכנן את שלבי הפתרון
4. בדוק את ההיגיון של התוצאה

טיפ: נסה לצייר את המצב המתואר בשאלה אם אפשר`
    };
  },

  hint: (question) => {
    return {
      type: 'hint',
      title: 'רמז',
      content: `רמז שיכול לעזור:
חשוב על הקשר בין הנתונים שקיבלת. 
האם יש נוסחה מוכרת שמקשרת ביניהם?
נסה להיזכר בשאלות דומות שפתרת בעבר.`
    };
  },

  fullSolution: (question) => {
    return {
      type: 'solution',
      title: 'פתרון מלא',
      content: `הפתרון המלא מורכב מהשלבים הבאים:

1. ניתוח הנתונים:
   - רשום את כל הנתונים
   - הבן מה נדרש למצוא

2. דרך הפתרון:
   - השתמש בנוסחאות המתאימות
   - פתור שלב אחר שלב

3. בדיקת הפתרון:
   - וודא שהתוצאה הגיונית
   - בדוק את היחידות

התשובה הסופית נמצאת בפתרון המלא של השאלה.`
    };
  },

  resources: (question) => {
    return {
      type: 'assistant',
      title: 'חומר עזר',
      content: `הנה חומר עזר שיכול לעזור לך בנושא הזה:

📚 סיכומים ומסמכים:
• סיכום מקיף בנושא ${question.topic}
• דפי נוסחאות רלוונטיים
• מאגר תרגילים פתורים

🎥 סרטוני הסבר מומלצים:
• סרטון הסבר על הנושא
• פתרון תרגילים דומים
• טיפים וטריקים לפתרון

🔗 קישורים שימושיים:
• מאמר מעמיק בנושא
• תרגול אינטראקטיבי
• כלים מקוונים שיכולים לעזור

האם תרצה שאפנה אותך למשהו ספציפי מתוך הרשימה?`
    };
  }
};

// Service functions
export const getQuestionExplanation = (question) => {
  return Promise.resolve(mockAssistance.questionExplanation(question));
};

export const getSolutionGuide = (question) => {
  return Promise.resolve(mockAssistance.solutionGuide(question));
};

export const getHint = (question) => {
  return Promise.resolve(mockAssistance.hint(question));
};

export const getFullSolution = (question) => {
  return Promise.resolve(mockAssistance.fullSolution(question));
};

export const getResources = (question) => {
  return Promise.resolve(mockAssistance.resources(question));
}; 