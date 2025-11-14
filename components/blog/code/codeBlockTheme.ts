// monochrome-dark.ts
import type { PrismTheme } from "prism-react-renderer"

/*/ old theme /*/

// export const monochromeDark: PrismTheme = {
//   plain: {
//     color: "hsl(0 0% 92%)",
//     backgroundColor: "hsl(0 0% 8%)",
//   },
//   styles: [
//     {
//       types: ["comment", "prolog", "doctype", "cdata"],
//       style: { color: "hsl(0 0% 40%)", fontStyle: "italic" as const },
//     },
//     {
//       types: ["punctuation"],
//       style: { color: "hsl(0 0% 50%)" },
//     },
//     {
//       types: ["operator", "boolean", "symbol"],
//       style: { color: "hsl(0 0% 68%)", fontWeight: "bold" },
//     },
//     {
//       types: ["keyword"],
//       style: { color: "hsl(0 0% 50%)", fontWeight: "bold" },
//     },
//     {
//       types: ["function", "class-name", "property", "namespace"],
//       style: { color: "hsl(0 0% 76%)" },
//     },
//     {
//       types: ["string", "attr-value", "inserted"],
//       style: { color: "hsl(0 0% 60%)" },
//     },
//     {
//       types: ["number"],
//       style: { color: "hsl(0 0% 64%)" },
//     },
//   ],
// }

/*/ new theme /*/

export const monochromeDark: PrismTheme = {
  plain: {
    color: "#a1a1aa",
    backgroundColor: "hsl(0 0% 8%)",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#27272a", fontStyle: "italic" as const },
    },
    {
      types: ["punctuation"],
      style: { color: "#71717a" },
    },
    {
      types: ["operator", "boolean", "symbol"],
      style: { color: "hsl(0 0% 68%)", fontWeight: "bold" },
    },
    {
      types: ["keyword"],
      style: { color: "#52525b", fontWeight: "bold" },
    },
    {
      types: ["function", "class-name", "property", "namespace"],
      style: { color: "#3f3f46" },
    },
    {
      types: ["string", "attr-value", "inserted", "number"],
      style: { color: "#52525b" },
    }
  ],
}
