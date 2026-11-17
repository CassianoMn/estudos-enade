import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export type ReaderFontSize = "sm" | "md" | "lg";

interface MarkdownViewerProps {
  content: string;
  areaId?: string;
  fontSize?: ReaderFontSize;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàâã]/g, "a")
    .replace(/[éèê]/g, "e")
    .replace(/[íìî]/g, "i")
    .replace(/[óòôõ]/g, "o")
    .replace(/[úùû]/g, "u")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  areaId,
  fontSize = "md",
}) => {
  return (
    <div className={`markdown-body reader-${fontSize}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h2: ({ children, ...props }) => {
            const headingText = extractText(children);
            const id = areaId
              ? `${areaId}__${slugifyHeading(headingText)}`
              : slugifyHeading(headingText);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
