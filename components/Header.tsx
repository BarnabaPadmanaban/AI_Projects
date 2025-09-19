
import React from 'react';

const DocumentIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 bg-slate-900/60 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <DocumentIcon />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
          DocuSummarize AI
        </h1>
      </div>
      <p className="text-center text-slate-400 mt-2">
        Upload PDFs or images and get an instant AI-powered summary.
      </p>
    </header>
  );
};
