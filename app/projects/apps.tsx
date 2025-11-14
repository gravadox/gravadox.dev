import AppDownloadSection from "@/components/app/downloadButton";
import { DownloadInput } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Data {
    id: string;
    title: string;
    description: string | null;
    banner: string | null;
    icon?: string | null
    version?: string | null
    slug: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishAt: Date | null;
    pinned: number | null;
    github?: string | null
    downloads: DownloadInput[]
}


export function Apps({data}:{data:Data[]}){
    return(
        <div className="flex flex-wrap p-4 gap-4 lg:gap-8 w-full h-fit">
        {data.map(app => (
            <div key={app.id} className="transition w-full flex flex-col border h-fit sm:min-h-[377px] relative md:max-w-[350px]">

                <Link href={`/projects/${app.slug}`}>
                <div className="w-full object-cover aspect-[10/4] border-b overflow-hidden flex items-center justify-center" >
                  {app.banner && (
                    <Image height={400} width={1000} src={app.banner} alt={app.title} className="w-full object-cover aspect-[10/4]" />
                  )}
                </div>
                </Link>
              <div className="p-2">
                <div className="flex items-center">
              {app.icon && (
                <Link href={`/projects/${app.slug}`}>
                <Image height={100} width={100} alt="icon" className="w-13" src={app.icon} />
                </Link>
              )}
              <h2 className="text-2xl font-bold mb-1 ml-2 hover:underline"><Link href={`/projects/${app.slug}`}>{app.title}</Link></h2>
                </div>
              {app.description && <p className="text-zinc-600 max-w-[500px] mb-2 whitespace-pre-line truncate line-clamp-2"   title={app.description || ""}>{app.description}</p>}

              {app.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap my-2">
                  {app.tags.map((tag, i) => (
                    <span key={i} className="px-2 max-w-[500px] py-0.5 text-sm bg-zinc-900 rounded-[2px]">
                      {tag}
                    </span>
              ))}
              
            </div>
            
            
          )}
          <AppDownloadSection downloads={app.downloads} />
                  {app.github && (
          <div className="text-zinc-600 flex justify-between w-full max-w-3xl">
            <div className="truncate">
              source: <a className="hover:underline" href={app.github ||""}>{app.github}</a>
            </div>
            {app.version && (
              <p className="min-w-25 truncate ml-6 pl-6 border-l">{app.version}</p>
            )}
            </div>
        )}
          {app.version && !app.github && (
              <p className="min-w-25 truncate text-right text-zinc-600">{app.version}</p>
          )}
              </div>
            </div>
        ))}
        </div>

    )
}