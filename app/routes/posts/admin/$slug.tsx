import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Post } from "~/models/post.server";
import { getPost } from "~/models/post.server";

type LoaderData = { post: Post; html: string };

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Form method="post">
      <p>
        <label>
          Post Title:
          <input
            type="text"
            name="title"
            className={inputClassName}
            placeholder={post.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          <input
            type="text"
            name="slug"
            className={inputClassName}
            placeholder={post.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:
            <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
            placeholder={post.markdown}
            />
        </label>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          "Update Post"
        </button>
      </p>
    </Form>
    </main>
  );
}