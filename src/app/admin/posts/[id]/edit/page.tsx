"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm, { PostFormInitial } from "@/components/admin/PostForm";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPostEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<PostFormInitial | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const article = await res.json();
        setData({
          id: article.id,
          slug: article.slug,
          status: article.status,
          primaryLocale: article.primaryLocale,
          authorId: article.authorId,
          blogCategoryId: article.blogCategoryId,
          featuredImage: article.featuredImage,
          translations: article.translations ?? [],
        });
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-gray-400">پست یافت نشد</CardContent>
      </Card>
    );
  }

  return <PostForm mode="edit" initial={data} />;
}
