'use client';

import React from 'react';
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

const DOMPurify = createDOMPurify(window);

const Markdown = ({ text }: Props) => {
  const htmlContent = md.render(text || '');
  const sanitizedContent = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>;
};

export default Markdown;