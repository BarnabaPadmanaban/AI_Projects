import React from 'react';

interface SummaryDisplayProps {
  summary: string;
  onReset: () => void;
}

const formatSummary = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${i}`} className="text-2xl font-bold mt-6 mb-3 text-cyan-100">{line.substring(2)}</h1>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold mt-5 mb-2 text-cyan-200">{line.substring(3)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-semibold mt-4 mb-1 text-cyan-300">{line.substring(4)}</h3>);
      i++;
      continue;
    }

    // Code Blocks
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++; // Move to next line
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`pre-${i}`} className="bg-slate-950 p-4 rounded-md my-4 overflow-x-auto text-sm font-mono text-cyan-300">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++; // consume the closing ```
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].substring(2));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="border-l-4 border-cyan-500 pl-4 italic text-slate-400 my-4">
          {quoteLines.join('\n')}
        </blockquote>
      );
      continue;
    }

    // Unordered Lists
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && (lines[i].startsWith('* ') || lines[i].startsWith('- '))) {
        listItems.push(
          <li key={`li-${i}`} className="text-slate-300">{lines[i].substring(2)}</li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4 space-y-1">{listItems}</ul>);
      continue;
    }

    // Paragraphs (default case)
    const paragraphLines = [];
    while (i < lines.length && lines[i].trim() !== '') {
      const currentLine = lines[i];
      if (
        currentLine.startsWith('#') ||
        currentLine.trim().startsWith('```') ||
        currentLine.startsWith('>') ||
        currentLine.startsWith('* ') ||
        currentLine.startsWith('- ')
      ) {
        break;
      }
      paragraphLines.push(currentLine);
      i++;
    }
    if (paragraphLines.length > 0) {
      elements.push(<p key={`p-${i}`} className="text-slate-200 mb-4 leading-relaxed">{paragraphLines.join(' ')}</p>);
    }
  }

  return elements;
};


export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, onReset }) => {
  return (
    <div className="p-6 md:p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
        Summary
      </h2>
      <div className="bg-slate-900/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-slate-700">
        {formatSummary(summary)}
      </div>
      <button
        onClick={onReset}
        className="mt-6 self-center px-8 py-2 font-semibold rounded-lg bg-slate-600 text-white
        hover:bg-slate-500 transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Summarize Another
      </button>
    </div>
  );
};