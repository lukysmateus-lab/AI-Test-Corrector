import React, { useState, useCallback, useMemo } from 'react';
import { AnswerKey, GradedAnswer, StudentAnswer } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnswerKeyInput from './components/AnswerKeyInput';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { gradeTestFromImage } from './services/geminiService';
import ReviewAnswers from './components/ReviewAnswers';

type View = 'setup' | 'review' | 'results';

const App: React.FC = () => {
    const [view, setView] = useState<View>('setup');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [studentName, setStudentName] = useState<string>('');
    const [answerKey, setAnswerKey] = useState<AnswerKey>({});
    const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[] | null>(null);
    const [gradedResults, setGradedResults] = useState<GradedAnswer[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const imagePreviewUrl = useMemo(() => {
        if (imageFile) {
            return URL.createObjectURL(imageFile);
        }
        return null;
    }, [imageFile]);

    const handleFileChange = (file: File | null) => {
        setImageFile(file);
        setStudentAnswers(null);
        setGradedResults(null);
        setStudentName('');
        setError(null);
        setView('setup');
    };

    const handleAnswerKeyChange = (key: AnswerKey) => {
        setAnswerKey(key);
    };

    const isAnswerKeyComplete = useMemo(() => {
        for (let i = 1; i <= 30; i++) {
            if (!answerKey[i] || answerKey[i].length === 0) {
                return false;
            }
        }
        return true;
    }, [answerKey]);
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyzeTest = useCallback(async () => {
        if (!imageFile || !isAnswerKeyComplete) {
            setError("Please upload a test paper and complete the answer key (at least one answer for each question).");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGradedResults(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const mimeType = imageFile.type;
            const { studentName: aiStudentName, answers: aiAnswers } = await gradeTestFromImage(base64Image, mimeType);

            setStudentName(aiStudentName);

            // Ensure all 30 questions are present, adding N/A if not found by AI
            const fullAnswers: StudentAnswer[] = [];
            for (let i = 1; i <= 30; i++) {
                const found = aiAnswers.find(a => a.questionNumber === i);
                if (found) {
                    fullAnswers.push(found);
                } else {
                    fullAnswers.push({ questionNumber: i, markedAnswer: 'N/A' });
                }
            }

            setStudentAnswers(fullAnswers);
            setView('review');

        } catch (err) {
            console.error(err);
            setError("Failed to analyze the test. The AI model might be unable to read the image clearly. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, answerKey, isAnswerKeyComplete]);

    const handleFinalizeGrade = useCallback((correctedAnswers: StudentAnswer[]) => {
        setIsLoading(true);
        const results: GradedAnswer[] = [];
        for (let i = 1; i <= 30; i++) {
            const studentAnswer = correctedAnswers.find(sa => sa.questionNumber === i);
            const correctAnswers = answerKey[i] || [];
            const markedAnswer = studentAnswer ? studentAnswer.markedAnswer.toUpperCase() : 'N/A';
            
            results.push({
                questionNumber: i,
                studentAnswer: markedAnswer,
                correctAnswer: correctAnswers,
                isCorrect: correctAnswers.includes(markedAnswer),
            });
        }
        setGradedResults(results);
        setStudentAnswers(correctedAnswers);
        setView('results');
        setIsLoading(false);
    }, [answerKey]);
    
    const handleStartOver = () => {
        setView('setup');
        setImageFile(null);
        setStudentAnswers(null);
        setGradedResults(null);
        setStudentName('');
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                {view === 'setup' && (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <FileUpload onFileChange={handleFileChange} imagePreviewUrl={imagePreviewUrl} />
                            <AnswerKeyInput onAnswerKeyChange={handleAnswerKeyChange} />
                        </div>
                        <div className="flex flex-col space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Grade Test</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Once you've uploaded the test and filled the answer key, click the button below to start the AI analysis.</p>
                                <button
                                    onClick={handleAnalyzeTest}
                                    disabled={!imageFile || !isAnswerKeyComplete || isLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg"
                                >
                                    {isLoading ? <Loader /> : 'Analyze with AI'}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                                    <p className="font-bold">Error</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center">
                                    <Loader />
                                    <p className="text-lg font-semibold mt-4 text-gray-700 dark:text-gray-300">AI is analyzing the test...</p>
                                    <p className="text-gray-500 dark:text-gray-400">This might take a moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'review' && studentAnswers && !isLoading && (
                    <ReviewAnswers
                        initialAnswers={studentAnswers}
                        studentName={studentName}
                        onConfirm={handleFinalizeGrade}
                        onBack={() => setView('setup')}
                    />
                )}

                {view === 'results' && gradedResults && !isLoading && (
                     <div className="max-w-4xl mx-auto">
                        <ResultsDisplay results={gradedResults} studentName={studentName} />
                        <button
                          onClick={handleStartOver}
                          className="w-full mt-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center text-lg"
                        >
                            Grade Another Test
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;