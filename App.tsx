
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { Loader } from './components/Loader';
import { summarizeDocuments } from './services/geminiService';
import type { ProcessedFile } from './types';

// pdf.js is loaded from a script tag in index.html
declare const pdfjsLib: any;

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const resetState = () => {
    setFiles([]);
    setSummary('');
    setIsLoading(false);
    setLoadingMessage('');
    setError('');
  };

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      resetState();
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleSummarize = useCallback(async () => {
    if (files.length === 0) {
      setError('Please select at least one file to summarize.');
      return;
    }
    
    setIsLoading(true);
    setSummary('');
    setError('');

    try {
      setLoadingMessage('Preparing files...');
      const processedFiles: ProcessedFile[] = [];

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          setLoadingMessage(`Processing image: ${file.name}`);
          const base64Data = await fileToBase64(file);
          processedFiles.push({
            mimeType: file.type,
            data: base64Data.split(',')[1],
          });
        } else if (file.type === 'application/pdf') {
          setLoadingMessage(`Processing PDF: ${file.name}`);
          const pdfImages = await pdfToImages(file);
          processedFiles.push(...pdfImages);
        }
      }
      
      if (processedFiles.length === 0) {
        throw new Error("No processable content found in the selected files.");
      }

      setLoadingMessage('Generating summary with Gemini AI...');
      const result = await summarizeDocuments(processedFiles);
      setSummary(result);
    } catch (err: any) {
      console.error('Summarization Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [files]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const pdfToImages = async (file: File): Promise<ProcessedFile[]> => {
    const images: ProcessedFile[] = [];
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
        setLoadingMessage(`Processing page ${i} of ${pdf.numPages} from ${file.name}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
            console.warn(`Could not get canvas context for page ${i}`);
            continue;
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        images.push({
            mimeType: 'image/jpeg',
            data: imageDataUrl.split(',')[1],
        });
    }
    return images;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 overflow-hidden">
          {isLoading ? (
            <Loader message={loadingMessage} />
          ) : (
            <>
              {summary ? (
                <SummaryDisplay summary={summary} onReset={resetState} />
              ) : (
                <FileUpload 
                  files={files}
                  onFileChange={handleFileChange}
                  onSummarize={handleSummarize}
                  error={error}
                />
              )}
            </>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
