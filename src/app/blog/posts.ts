import { formatDate } from "@/utils/formatDate";

export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  description: string;
  /** JPEG shown on top of the post */
  image: string;
  /** 1200x630 social crop of `image`, used for OG/Twitter cards */
  ogImage: string;
};

const posts: BlogPost[] = [
  {
    slug: "how-should-you-set-up-your-distribution",
    title: "How should you set up your distribution?",
    date: "2026-10-28",
    description:
      "Two ways in, how long to run, how big a founder share to take, and how your setup builds participant trust.",
    image: "/blog/how-should-you-set-up-your-distribution.jpg",
    ogImage: "/blog/how-should-you-set-up-your-distribution.jpg",
  },
  {
    slug: "how-we-fixed-fund-raising",
    title: "How we fixed fund raising?",
    date: "2026-09-14",
    description:
      "Fund raising was broken: bots beat humans, whales take over, one-shot raises and instant dumps. We stretched the launch across epochs — here is how it works.",
    image: "/blog/how-we-fixed-fund-raising.jpg",
    ogImage: "/blog/how-we-fixed-fund-raising-og.jpg",
  },
];
export const blogPosts: BlogPost[] = [...posts].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
);

export const getPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

export const postDate = (post: BlogPost): string =>
  formatDate(new Date(`${post.date}T00:00:00`).getTime());
