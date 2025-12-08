"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { FiCopy, FiCheck } from "react-icons/fi";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-navy-900/80 border border-white/10">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 text-xs text-slate-400 font-mono">{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 overflow-x-auto text-sm font-mono`}
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-right text-slate-600 select-none">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      {/* Copy button for blocks without title */}
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <FiCheck className="w-4 h-4 text-green-400" />
          ) : (
            <FiCopy className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

