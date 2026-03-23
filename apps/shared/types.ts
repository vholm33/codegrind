export type CodeQuestion = {
    id: number;
    //" codeTitle: string; // titeln i frontend (dvs kategorinamnet)
    categoryName: string; //! NEW for dropdown, tidigare codeTitle
    codeQuestion: string;
    codeAnswer: string;
};

export interface Rating {
    sqlQuestionId: number; // sql ID för question
    sqlUserId: number; // sql ID för användaren
    userRating: number; // Användarens betygsättning
    // comment?: string; # lägga till kommentar?
}
// export interface RequestRatintg {}

// 1. Kopplar till varje HEL quiz session
export interface QuizSessions {
    userId: number; // Användaren som kört quiz
    totalQuestions: number; // Totalt antal frågor
    questionsAnswered: number; // Antal besvarade frågor
    totalPoints: number; // Antal poäng för hela quiz-sessionen
}

// 2. Kopplas till varje fråga i quiz-sessionen
export interface QuizAnswers {
    sessionId: number; // Användarens quiz-session
    questionId: number; // Användarens fråga i sessionen
    categoryName: string, //! Ny
    attempts: number; // Användarens försök per fråga
    points: number; // Användarens poäng per fråga
    isCorrect: boolean; // Lyckades användaren få rätt?
}

// API RESPONSE
export type ApiResponse<T = any> =
    | {
          success: boolean;
          message: string;
          data?: T;
      }
    | {
          success: false;
          error: string;
      };
