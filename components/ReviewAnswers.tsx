import React, { useState } from 'react';
import { StudentAnswer } from '../types';
import { IconArrowLeft, IconSparkles } from './Icons';

interface ReviewAnswersProps {
    initialAnswers: StudentAnswer[];
    studentName: string;
    onConfirm: (correctedAnswers: StudentAnswer[]) => void;
    onBack: () => void;
}

const AnswerOption: React.FC<{
    option: string;
    selected: boolean;
    onSelect: () => void;
}> = ({ option, selected, onSelect }) => (
    <button
        onClick={onSelect}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 border-2 ${
            selected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-blue-400'
        } ${option === 'N/A' ? 'text-xs' : 'text-sm'}`}
    >
        {option}
    </button>
);


const ReviewAnswers: React.FC<ReviewAnswersProps> = ({ initialAnswers, studentName, onConfirm, onBack }) => {
    const [answers, setAnswers] = useState<StudentAnswer[]>(initialAnswers);

    const handleSelect = (questionNumber: number, newMarkedAnswer: string) => {
        setAnswers(prevAnswers =>
            prevAnswers.map(ans =>
                ans.questionNumber === questionNumber
                    ? { ...ans, markedAnswer: newMarkedAnswer }
                    : ans
            )
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in w-full max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Review & Correct for <span className="text-indigo-600 dark:text-indigo-400">{studentName}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 -mt-2 text-center max-w-2xl mx-auto">The AI has analyzed the test paper. Review the marked answers below and correct any errors before finalizing the grade.</p>

            <div className="max-h-[60vh] overflow-y-auto pr-2 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {answers.sort((a,b) => a.questionNumber - b.questionNumber).map(({ questionNumber, markedAnswer }) => (
                        <div key={questionNumber} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <span className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">Question {questionNumber}</span>
                            <div className="flex items-center space-x-2">
                                {['A', 'B', 'C', 'D'].map(option => (
                                    <AnswerOption
                                        key={option}
                                        option={option}
                                        selected={markedAnswer.toUpperCase() === option}
                                        onSelect={() => handleSelect(questionNumber, option)}
                                    />
                                ))}
                                
                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                
                                <AnswerOption
                                    key="N/A"
                                    option="N/A"
                                    selected={markedAnswer.toUpperCase() === 'N/A'}
                                    onSelect={() => handleSelect(questionNumber, 'N/A')}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             <div className="flex flex-col sm:flex-row gap-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center text-lg"
                >
                    <IconArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button
                    onClick={() => onConfirm(answers)}
                    className="w-full sm:flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center text-lg"
                >
                    Confirm & Grade Test
                    <IconSparkles className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default ReviewAnswers;