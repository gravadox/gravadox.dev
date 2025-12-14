import { XPInput } from "@/app/admin/cv/page"

interface Props {
  data: XPInput[]
}

export default function ExperienceTimeline({ data }: Props) {
  if (!data.length) return null

  return (
    <div className="grid grid-cols-[auto_auto_auto] gap-x-8 w-fit">
      {data.map((item, i) => (
        <div key={item.id} className="relative contents">

          {/* Date */}
          <div className="text-sm text-zinc-400 pt-1">
            {item.date}
          </div>

          {/* Line + Center Dot */}
          <div className="relative flex justify-center">
            {/* Full vertical line */}
            <div className="absolute top-0 bottom-0 w-px bg-zinc-300" />

            {/* Dot centered vertically on this entry */}
            <div className="w-[7px] h-[7px] bg-zinc-300 rounded-full translate-y-[6px] z-10" />
          </div>

          {/* Content */}
          <div className="pb-6">
            <a target="_blank" href={item.url || undefined} className={`font-medium text-zinc-300 ${item.url?"hover:underline": ""}`}>{item.work}</a>
            <div className="italic text-zinc-500 text-sm">{item.at}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
