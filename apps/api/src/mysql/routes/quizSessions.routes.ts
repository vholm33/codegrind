/*
CREATE TABLE IF NOT EXISTS quizSessions(
     id INT PRIMARY KEY AUTO_INCREMENT,
     userId INT NOT NULL,                   -- Användaren som kört quiz
     totalQuestions INT NOT NULL,           -- Totalt antal frågor
     questionsAnswered INT NOT NULL,        -- Antal besvarade frågor
     totalPoints INT DEFAULT 0,             -- Antal poäng för hela quiz-sessionen

     FOREIGN KEY (userId) REFERENCES users(id)
);
INSERT IGNORE INTO quizSessions(userId, totalQuestions, questionsAnswered, totalPoints)
VALUES
    (1, 16, 14, 16),
    (2, 16, 16, 23),
    (3, 16, 16, 20)
*/
import express from 'express'

const 
