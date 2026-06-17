"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownTextProps {
  text: string;
}

// Custom syntax example:
// [text](url) → link
// **bold** → bold
// *italic* → italic
// __underline__ → underline
// ~~line-through~~ → line-through
// ==highlight== → highlight
// {comment:text} → tooltip comment
// - bullet list

export default function MarkdownText({ text }: MarkdownTextProps) {
  // Transform custom syntaxes before passing to ReactMarkdown
  const processedText = text
    // Highlight
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    // Underline (convert __text__ to <u>text</u>; note: this will override markdown's __ bold syntax)
    .replace(/__([^_]+?)__/g, "<u>$1</u>")
    // Comment syntax {label:tooltip} → <span title="tooltip">label</span>
    .replace(/{([^:]+):([^}]+)}/g, '<span title="$2">$1</span>');

  return (
    <div className="w-full my-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Block dangerous raw-HTML elements that should never appear in post content
          script: () => null,
          iframe: () => null,
          object: () => null,
          embed: () => null,
          form: () => null,
          // Links
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-zinc-500 hover:text-zinc-200 underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // Bold
          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          // Italic
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          // Underline (rendered from raw <u> tags)
          u: ({ node, ...props }) => <u className="underline" {...props} />,
          // Strikethrough
          del: ({ node, ...props }) => <del className="line-through" {...props} />,
          // Highlight
          mark: ({ node, ...props }) => <mark className="bg-zinc-800 text-white p-0.5" {...props} />,
          // Bullet lists
          ul: ({ node, ...props }) => <ul className="list-disc ml-5 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          // Span (for comments)
          span: ({ node, ...props }) => <span className="bg-zinc-950 border border-zinc-800 p-0.5 rounded" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-5xl font-bold mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-4xl font-semibold mt-3 mb-1.5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-3xl font-medium mt-2 mb-1" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-2xl font-medium mt-2 mb-1" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-xl font-medium mt-2 mb-1" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-lg font-medium mt-2 mb-1" {...props} />,
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
}
