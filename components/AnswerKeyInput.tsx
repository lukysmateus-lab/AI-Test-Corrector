
import React, { useState, useEffect } from 'react';
import { AnswerKey } from '../types';

interface AnswerKeyInputProps {
    onAnswerKeyChange: (key: AnswerKey) => void;
}

const AnswerOption: React.FC<{
    question: number;
    option: string;
    selected: boolean;
    onSelect: (question: number, option: string) => void;
}> = ({ question, option, selected, onSelect }) => (
    <button
        onClick={() => onSelect(question, option)}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${selected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-indigo-400'
            }`}
    >
        {option}
    </button>
);

const AnswerKeyInput: React.FC<AnswerKeyInputProps> = ({ onAnswerKeyChange }) => {
    const [answers, setAnswers] = useState<AnswerKey>({});

    useEffect(() => {
        onAnswerKeyChange(answers);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers]);

    const handleSelect = (question: number, option: string) => {
        setAnswers(prev => {
            const currentAnswers = prev[question] ? [...prev[question]] : [];
            const newAnswers = { ...prev };

            if (currentAnswers.includes(option)) {
                // Deselect if already selected
                newAnswers[question] = currentAnswers.filter(a => a !== option);
            } else {
                // Select if not selected, up to a max of 2
                if (currentAnswers.length < 2) {
                    newAnswers[question] = [...currentAnswers, option].sort();
                } else {
                    return prev;
                }
            }
            
            if (newAnswers[question].length === 0) {
                delete newAnswers[question];
            }

            return newAnswers;
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Fill Answer Key</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-2">Select up to two correct answers for each question.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((questionNumber) => (
                    <div key={questionNumber} className="flex flex-col items-center">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Q{questionNumber}</span>
                        <div className="flex space-x-1">
                            {['A', 'B', 'C', 'D'].map(option => (
                                <AnswerOption
                                    key={option}
                                    question={questionNumber}
                                    option={option}
                                    selected={answers[questionNumber]?.includes(option) ?? false}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerKeyInput;
