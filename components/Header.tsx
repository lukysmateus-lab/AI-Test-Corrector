
import React from 'react';
import { IconDocumentCheck } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
                <IconDocumentCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold ml-3 text-gray-900 dark:text-white">
                    AI Test Grader
                </h1>
            </div>
        </header>
    );
};

export default Header;
