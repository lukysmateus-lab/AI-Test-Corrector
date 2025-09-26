import React, { useMemo } from 'react';
import { GradedAnswer } from '../types';
import { IconCheck, IconX } from './Icons';

interface ResultsDisplayProps {
    results: GradedAnswer[];
    studentName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, studentName }) => {
    const correctCount = useMemo(() => results.filter(r => r.isCorrect).length, [results]);
    const score = useMemo(() => ((correctCount / results.length) * 100).toFixed(1), [correctCount, results.length]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Grading Results for <span className="text-indigo-600 dark:text-indigo-400">{studentName}</span>
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-around items-center mb-6">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">SCORE</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{score}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">CORRECT</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">INCORRECT</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{results.length - correctCount}</p>
                </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                    {results.map(res => (
                        <div key={res.questionNumber}
                             className={`p-3 rounded-lg flex items-center justify-between transition-colors ${res.isCorrect ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'}`}>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${res.isCorrect ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
                                    {res.questionNumber}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Marked: <span className="font-bold text-gray-800 dark:text-gray-200">{res.studentAnswer}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Correct: <span className="font-bold text-gray-800 dark:text-gray-200">{res.correctAnswer.join(', ')}</span>
                                    </p>
                                </div>
                            </div>
                            {res.isCorrect ? (
                                <IconCheck className="w-6 h-6 text-green-500" />
                            ) : (
                                <IconX className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;