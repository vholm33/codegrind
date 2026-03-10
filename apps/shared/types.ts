export type CodeQuestion = {
    id: number;
    //" codeTitle: string; // titeln i frontend (dvs kategorinamnet)
    categoryName: string; //! NEW for dropdown, tidigare codeTitle
    codeQuestion: string;
    codeAnswer: string;
};
