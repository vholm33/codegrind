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
