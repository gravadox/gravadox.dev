import Link from "next/link";
import Image from "next/image";

interface Data {
    id: string;
    title: string;
    description: string | null;
    banner: string | null;
    slug: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishAt: Date | null;
    pinned: number | null;
}

export function Blogs({ data }: { data: Data[] }) {
    return (
        <div className="w-full flex flex-col items-center mt-4 gap-6">
            {data.map(post => (
                <div
                    key={post.id}
                    className="flex  p-4  w-full max-w-5xl transition gap-4"
                >
                    <div className="flex-1 flex flex-col justify-center max-w-66 min-[400px]:max-w-full">
                        <h2 className="text-2xl font-bold mb-1">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        {post.description && (
                            <p
                                className="text-zinc-600 mb-2 whitespace-pre-line line-clamp-2"
                                title={post.description || ""}
                            >
                                {post.description}
                            </p>
                        )}
                        {post.tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {post.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 text-sm bg-zinc-900 text-white rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    {post.banner && (
                        <Link href={`/blog/${post.slug}`} className="h-full flex-shrink-0 relative aspect-[10/6] overflow-hidden max-[500px]:w-20">
                            <Image
                                width={1000}
                                height={600}
                                src={post.banner}
                                alt={post.title}
                                className="object-cover h-full aspect-[10/6] rounded w-64"
                            />
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}
