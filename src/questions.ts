export interface Question {
  text: string;
  options: string[];
  answer: number; // Index of the correct option
}

export const QUESTIONS: Question[] = [
  {
    text: "Manakah bahasa pemrograman yang digunakan untuk membuat aplikasi Android di App Inventor?",
    options: ["Java", "Kotlin", "Blocks", "Swift"],
    answer: 2,
  },
  {
    text: "Apa fungsi utama dari CSS dalam pembuatan website?",
    options: ["Struktur Data", "Logika Program", "Tampilan/Style", "Database"],
    answer: 2,
  },
  {
    text: "Siapakah pencipta bahasa pemrograman Python?",
    options: ["Guido van Rossum", "Mark Zuckerberg", "Bill Gates", "Elon Musk"],
    answer: 0,
  },
  {
    text: "Apa kepanjangan dari HTML?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Tool Maker Line", "Home Tool Markup Language"],
    answer: 0,
  },
  {
    text: "Manakah yang merupakan database NoSQL?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    answer: 2,
  },
  {
    text: "Apa singkatan dari API?",
    options: ["Apple Programming Interface", "Application Programming Interface", "Advanced Program Integration", "Automated Process Input"],
    answer: 1,
  },
  {
    text: "Tag HTML yang digunakan untuk membuat link adalah...",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: 1,
  },
  {
    text: "Dalam JavaScript, 'NaN' adalah singkatan dari...",
    options: ["New and Next", "Not a Number", "Node and Net", "Null and None"],
    answer: 1,
  }
];
