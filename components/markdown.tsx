'use client';

import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import createDOMPurify from 'isomorphic-dompurify';

type Props = {
  text: string;
};

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const Markdown = ({ text }: Props) => {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const DOMPurify = createDOMPurify(window);
      const htmlContent = md.render(text || '');
      setSanitizedContent(DOMPurify.sanitize(htmlContent));
    }
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>;
};

export default Markdown;