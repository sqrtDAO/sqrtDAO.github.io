import { codeToHtml } from "shiki";

type CodeBlockProps = { code: string; caption?: string };

const CodeBlock = async ({ code, caption }: CodeBlockProps) => {
  const html = await codeToHtml(code.trim(), { lang: "solidity", theme: "vesper" });
  return (
    <figure className="mt-8 overflow-hidden rounded-l border border-subtle bg-canvas">
      {caption && (
        <figcaption className="border-b border-subtle bg-raised px-4 py-2.5 font-mono text-caption text-tertiary">
          {caption}
        </figcaption>
      )}
      <div
        className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-body-s [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
};

export default CodeBlock;
