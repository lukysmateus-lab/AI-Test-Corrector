
export interface AnswerKey {
  [key: number]: string[];
}

export interface StudentAnswer {
  questionNumber: number;
  markedAnswer: string;
}

export interface GradedAnswer {
  questionNumber: number;
  studentAnswer: string;
  correctAnswer: string[];
  isCorrect: boolean;
}
