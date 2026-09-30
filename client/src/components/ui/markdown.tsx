'use client';

import * as React from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';

import { cn } from '@/lib/utils';

export interface MarkdownProps extends Options {
  className?: string;
}

const defaultComponents: NonNullable<Options['components']> = {
  a: ({ className, href, ...props }) => {
    const safeHref = DOMPurify.sanitize(href ?? '', {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).trim();
    const isSafe =
      safeHref.startsWith('http://') ||
      safeHref.startsWith('https://') ||
      safeHref.startsWith('/') ||
      safeHref.startsWith('#') ||
      safeHref.startsWith('mailto:');
    return (
      <a
        className={cn(className)}
        href={isSafe ? safeHref : '#'}
        rel="noreferrer noopener"
        target="_blank"
        {...props}
      />
    );
  },
  img: ({ className, alt, src, ...props }) => {
    const safeSrc = DOMPurify.sanitize(src ?? '', {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).trim();
    const isSafe =
      safeSrc.startsWith('http://') ||
      safeSrc.startsWith('https://') ||
      safeSrc.startsWith('data:image/') ||
      safeSrc.startsWith('/');
    return (
      <img
        className={cn(className)}
        alt={alt ?? ''}
        src={isSafe ? safeSrc : ''}
        loading="lazy"
        {...props}
      />
    );
  },
};

export function Markdown({
  className,
  remarkPlugins,
  components,
  ...props
}: MarkdownProps) {
  return (
    <div className={cn('prose max-w-none dark:prose-invert', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
        components={{ ...defaultComponents, ...components }}
        {...props}
      />
    </div>
  );
}
