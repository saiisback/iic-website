import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function EventReport({ markdown }: { markdown: string }) {
  const body = markdown.replace(/^#{1,6}\s[^\n]*\n+/, "");

  return (
    <div className="report-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
