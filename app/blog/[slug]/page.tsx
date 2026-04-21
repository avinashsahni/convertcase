import { getBlogBySlug, blogs } from '../../../lib/blogs';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    alternates: { canonical: `https://convertcase.in/blog/${blog.slug}` },
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: `https://convertcase.in/blog/${blog.slug}`,
      type: 'article',
      publishedTime: blog.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();
  return <BlogPostClient blog={blog} />;
}