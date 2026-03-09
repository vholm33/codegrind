USE railway;

DROP TABLE IF EXISTS codeQuestions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
   id int PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL,
   password_hash VARCHAR(100) NOT NULL,
   created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) NULL
);

CREATE TABLE IF NOT EXISTS categories(
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL UNIQUE, -- 1. lägga till kategorinamn
     handout TEXT -- 2. handout för varje kategori
);
-- Lägger till direkt i backend, inte i frontend
INSERT IGNORE INTO categories(name, handout) -- handout text kort
VALUES
    ('Konstanter', '...'),
    ('Loopar', '...'),
    ('TypeScript', '...'),
    ('Metoder', '...')
;

-- Lägg till flera kategorier
CREATE TABLE IF NOT EXISTS codeQuestions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Tog bort codeTitle, ta bort i frontend
    categoryId INT,
    codeQuestion VARCHAR(100) NOT NULL,
    codeAnswer VARCHAR(150) NOT NULL,

    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);
-- Lägg till en fråga i varje kategori för att testa
INSERT IGNORE INTO codeQuestions(categoryId, codeQuestion, codeAnswer)
VALUES
    -- 1. Konstanter
    (1, 'Tilldela konstanter (a, b, c) med värdena (1, 2, 3). Använd bara const en gång', 'const a = 1, b = 2, c = 3'),
    (1, 'Initiera en tom array "arr" med let', 'let arr = []'),
    (1, 'Initiera ett nytt Map objekt som konstanten "map"', 'const map = new Map()'),

    -- 2. Loopar
    (2, 'Skriv en enkel for-loop, som loggar från 0-4', 'for (let i = 0; i < 5; i++) { console.log(i) }'),
    (2, 'Deklarera "i" till 0, och gör en do-while loop där du konsol-loggar i 5 gånger. Använd i++ inom loggen.', 'let i = 0 do { console.log(i++) } while (i < 5)'),
    (2, 'Du har redan en array "arr" med värden [3, 5, 7], konsol-logga värdena med en for...in med konstanten "i"', 'for (const i in arr) { console.log(i) }'),
    (2, 'Du har en array "dogs" med hundraser. Använd array-metoden forEach() på arrayen med en arrow-funktion som loggar varje "dog"', 'dogs.forEach(dog => console.log(dog))'),

    -- 3. TypeScript (blandat)
    (3, 'Gör en type "Person", med egenskaper namn och ålder med rätt datatyper', 'type Person = { name: string; age: number; }'),
    (3, 'Initiera en tom array "arr" som ska bara ska innehålla siffror', 'let arr: number[] = []'),
    (3, 'Deklarera "isActive" som sann med let', 'let isActive: boolean = true'),
    (3, 'Gör en konstant "add", gör den till en arrow-funktion med "a" och "b" som parametrar. Ge parametrar och returresultat till typen  number.', 'const add = (a: number, b: number): number => a + b'),

    -- 4. Metoder (blandade datatyper)
    (4, 'Du har redan en array "fruits" med frukter. Frukten mango finns i arrayen. Använd array-metoden includes() och få tillbaks en boolean som bevis att den finns i arrayen.', 'fruits.includes("mango")'),
    (4, 'Du har redan en osorterad array "bokstäver". Använd en metod för att sortera arrayen i bokstavsordning', 'bokstäver.sort()'),
    (4, 'Du har en array "numbers" med värden [3, 5, 7]. Använd en metod som vänder ordningen på värdena i arrayen till [7, 5, 3]', 'numbers.reverse()'),
    (4, 'Gör en konstant "add", använd en arrow-funktion för att addera "x" med "x"', 'const add = x => x + x'),
    (4, 'Gör en konstant "hello", använd en parameterfri arrow-funktion som konsol-loggar "hello there"', 'const hello = () => console.log("hello")')
;
-- Junction table : bara om kategorier koppas till flera frågor
# CREATE TABLE IF NOT EXISTS categories_codeQuestions(
#     categoryId INT, -- ökar redan i FK
#     questionId INT, -- ökar reda i FK
#
#     PRIMARY KEY (categoryId, questionId),
#     FOREIGN KEY (categoryId) REFERENCES categories(id),
#     FOREIGN KEY (questionId) REFERENCES codeQuestions(id)
# );
