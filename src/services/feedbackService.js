import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateFeedback = async (question, userAnswer, selectedSubject, selectedExam) => {
  try {
    // Special handling for multiple choice questions
    if (question.question.type === 'multiple_choice') {
      const isCorrect = userAnswer.trim() === question.solution.final_answer.trim();
      return {
        analysis: {
          correct_parts: isCorrect ? 
            "כל הכבוד! בחרת את התשובה הנכונה." : 
            "התשובה שבחרת אינה נכונה.",
          mistakes: isCorrect ? 
            "" : 
            `התשובה הנכונה היא ${question.solution.final_answer}`,
          guidance: isCorrect ? 
            "המשך כך!" : 
            "נסה לקרוא את השאלה שוב בעיון ולבחון את כל האפשרויות בקפידה."
        },
        assessment: {
          correctness_percentage: isCorrect ? 100 : 0
        }
      };
    }

    // For other question types, continue with the existing OpenAI feedback generation
    const subjectName = selectedSubject?.name || 'mathematics';
    const examName = selectedExam?.name || 'bagrut';
    
    const prompt = `
      As a ${subjectName} teacher preparing students for ${examName} exams, provide personal and encouraging feedback to the student.
      
      Question: ${question.question.text}
      Student's answer: ${userAnswer}
      Correct solution:
      ${question.solution.explanation}
      ${question.solution.steps ? '\nSolution steps:\n' + question.solution.steps.map((step, index) => `${index + 1}. ${step.explanation}`).join('\n') : ''}
      ${question.solution.final_answer ? `Final answer: ${question.solution.final_answer}` : ''}
      
      Provide feedback in this exact JSON structure:
      {
        "analysis": {
          "correct_parts": "פנה לתלמיד ישירות. ציין את כל החלקים הנכונים בתשובתו, כולל:
            - שימוש נכון בנוסחאות
            - צעדים מתמטיים נכונים
            - הצבות נכונות
            - חישובים נכונים
            - מסקנות נכונות
            השתמש בדוגמאות ספציפיות מתשובת התלמיד.",

          "mistakes": "הסבר בדיוק היכן טעה, מה חסר בתשובתו, ואיך זה משפיע על הפתרון. התייחס ל:
            - טעויות בהבנת השאלה
            - טעויות בשימוש בנוסחאות
            - טעויות בחישובים
            - חלקים חסרים בפתרון
            השתמש בדוגמאות ספציפיות מתשובתו.",

          "guidance": "הדרך את התלמיד כיצד לגשת לפתרון השאלה, בלי לתת את הפתרון עצמו:
            - איזה ידע או נוסחאות צריך להכיר
            - איך לנתח את השאלה
            - איזה שיטות פתרון מתאימות
            - על מה חשוב להקפיד
            עודד את התלמיד ותן לו כלים להצליח בפעם הבאה."
        },
        "assessment": {
          "correctness_percentage": number (0-100)
        }
      }

      Guidelines for feedback:
      1. Address the student directly using "אתה/את"
      2. List ALL correct parts, no matter how small
      3. Be specific about mistakes and their impact
      4. For guidance:
         - Focus on methods and approaches
         - Explain WHY certain methods work
         - DON'T give direct solutions
         - DO give problem-solving strategies
      5. Be encouraging and supportive
      6. Emphasize learning and understanding

      CRITICAL: All mathematical expressions MUST be properly escaped in JSON:
      - Use \\\\ (four backslashes) for LaTeX commands
      - Example: "\\\\( \\\\alpha = 30^\\\\circ \\\\)"
      - NO line breaks in the text
      - NO unescaped backslashes`;

    // Log the request
    console.log('=== Feedback Generation Request ===');
    console.log('Subject:', subjectName);
    console.log('Exam:', examName);
    console.log('Question:', question.question.text);
    console.log('Student Answer:', userAnswer);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional ${subjectName} teacher providing feedback in Hebrew.
            
          CRITICAL: Format ALL mathematical expressions with FOUR backslashes:
          CORRECT: "נתון משולש שבו \\\\( \\\\alpha = 30^\\\\circ \\\\)"
          WRONG: "נתון משולש שבו \\( \\alpha = 30^\\circ \\)"
          
          Rules for math expressions:
          1. Use \\\\( and \\\\) for ALL math
          2. Use \\\\alpha, \\\\beta, \\\\gamma (not A, B, C)
          3. Use \\\\mathrm{} for units
          4. Use \\\\, for spacing
          5. NO line breaks
          6. NO \\\\text
          7. NO \\\\angle
          
          Your response MUST be a valid JSON object with properly escaped strings.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    // Get the raw response
    let content = completion.choices[0].message.content.trim();
    
    // Log the raw response
    console.log('=== Raw OpenAI Response ===');
    console.log(content);

    // Clean up the JSON string
    content = content
      // Remove all newlines and extra spaces
      .replace(/\n\s*/g, '')
      // Make sure we have proper JSON structure
      .replace(/}+$/, '')  // Remove any trailing braces
      .replace(/,?\s*}$/, '')  // Remove last brace and optional comma
      + '}}';  // Add exactly two closing braces

    // Log the cleaned response
    console.log('=== Cleaned Response ===');
    console.log(content);

    try {
      // Parse the JSON
      const feedbackData = JSON.parse(content);

      // Create a clean feedback object with default values
      const processedFeedback = {
        analysis: {
          correct_parts: feedbackData.analysis?.correct_parts || '',
          mistakes: feedbackData.analysis?.mistakes || '',
          guidance: feedbackData.analysis?.guidance || ''
        },
        assessment: {
          correctness_percentage: feedbackData.assessment?.correctness_percentage ?? 0
        }
      };

      // Log the processed feedback
      console.log('=== Processed Feedback ===');
      console.log('Analysis:', processedFeedback.analysis);
      console.log('Assessment:', processedFeedback.assessment);

      return processedFeedback;

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Content that failed to parse:', content);
      
      // Try to extract values using regex as fallback
      try {
        const correctParts = content.match(/"correct_parts":\s*"([^"]+)"/)?.[1] || '';
        const mistakes = content.match(/"mistakes":\s*"([^"]+)"/)?.[1] || '';
        const guidance = content.match(/"guidance":\s*"([^"]+)"/)?.[1] || '';
        const percentage = parseInt(content.match(/"correctness_percentage":\s*(\d+)/)?.[1] || '0', 10);

        return {
          analysis: {
            correct_parts: correctParts,
            mistakes: mistakes,
            guidance: guidance
          },
          assessment: {
            correctness_percentage: percentage
          }
        };
      } catch (fallbackError) {
        // If all else fails, return default feedback
        return {
          analysis: {
            correct_parts: 'אירעה שגיאה בעיבוד התשובה.',
            mistakes: 'לא ניתן לנתח את התשובה כרגע.',
            guidance: 'אנא נסה שוב או פנה לתמיכה אם הבעיה נמשכת.'
          },
          assessment: {
            correctness_percentage: 0
          }
        };
      }
    }

  } catch (error) {
    console.error('Feedback Generation Error:', error);
    throw new Error('Failed to generate feedback: ' + error.message);
  }
};

const validateFeedbackStructure = (feedback) => {
  try {
    // Check if feedback exists and is an object
    if (!feedback || typeof feedback !== 'object') return false;

    // Check analysis section
    if (!feedback.analysis || typeof feedback.analysis !== 'object') return false;
    if (typeof feedback.analysis.correct_parts !== 'string') return false;
    if (typeof feedback.analysis.mistakes !== 'string') return false;
    if (typeof feedback.analysis.guidance !== 'string') return false;

    // Check assessment section
    if (!feedback.assessment || typeof feedback.assessment !== 'object') return false;
    if (typeof feedback.assessment.correctness_percentage !== 'number') return false;
    if (feedback.assessment.correctness_percentage < 0 || feedback.assessment.correctness_percentage > 100) return false;

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}; 