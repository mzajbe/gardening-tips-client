/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import {
  Bug,
  Crown,
  FilePenLine,
  LifeBuoy,
  MessageSquareWarning,
  UserRound,
  Users,
} from "lucide-react";

const supportTopics = [
  {
    title: "Account and login",
    description:
      "Use this for sign-in issues, profile updates, or anything related to your account.",
    icon: UserRound,
  },
  {
    title: "Posts and comments",
    description:
      "Get help creating posts, editing content, adding images, or managing comments.",
    icon: FilePenLine,
  },
  {
    title: "Premium access",
    description:
      "Use this section if premium content or subscription access is not behaving as expected.",
    icon: Crown,
  },
  {
    title: "Groups and community",
    description:
      "Find guidance for joining groups, community participation, and collaboration.",
    icon: Users,
  },
  {
    title: "Report a problem",
    description:
      "Tell us about broken pages, loading problems, or any behavior that feels wrong.",
    icon: Bug,
  },
  {
    title: "Safety and reporting",
    description:
      "Reach out if you need to report spam, abuse, or content that should be reviewed.",
    icon: MessageSquareWarning,
  },
];

const faqs = [
  {
    question: "How do I create a gardening post?",
    answer:
      "Open Create Post from the sidebar, add a title, write your content, choose a category, and publish it.",
  },
  {
    question: "How do I follow or unfollow someone?",
    answer:
      "Use the Follow button on a post card or profile page. The button updates immediately after you click it.",
  },
  {
    question: "How does premium work?",
    answer:
      "Premium gives access to premium gardening content. If you have already subscribed and still cannot open content, contact support below.",
  },
  {
    question: "Can I edit or delete my posts and comments?",
    answer:
      "Yes. Use the three-dot menu on your post to edit or delete it, and use the comment controls inside the comment dialog for your own comments.",
  },
  {
    question: "What should I do if an image or page does not load?",
    answer:
      "Refresh once, check your connection, and try again. If the issue continues, send a short report with the page name and what you were trying to do.",
  },
];

const HelpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      topic: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <LifeBuoy className="h-4 w-4" />
              Help Center
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How can we help?
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Check the most common support topics first. If your issue is not covered,
              use the form below and send the details clearly.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">
              Quick Help Topics
            </h2>
            <p className="mt-2 text-muted-foreground">
              Start with the topic that best matches what you need.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportTopics.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-border bg-muted/40 p-5"
                >
                  <h3 className="text-base font-semibold">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Contact Support
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use this form if you still need help after checking the common topics.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="topic" className="mb-2 block text-sm font-semibold">
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select a topic</option>
                  {supportTopics.map((topic) => (
                    <option key={topic.title} value={topic.title}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Explain the issue, what page you were on, and what you expected to happen."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-green-700"
              >
                Send Request
              </button>
            </form>

            {submitted && (
              <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Your support request has been recorded in this form UI. Connect this form to your backend when you are ready.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
