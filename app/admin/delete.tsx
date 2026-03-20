// "use client"
// import { deleteApp } from "@/actions/admin";
// import { deletePost } from "@/actions/admin";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function DeletePostOrApp({id, type}:{id: string, type:"app"|"post"}){
  
//     const handleDelete = async (id: string) => {
//     try {
//       if(type==="post")
//       {
//         await deletePost(id)
//         toast.success("Deleted successfully")
//         window.location.reload()
//       }
//       if(type==="app"){
//         await deleteApp(id)
//         toast.success("Deleted successfully")
//         window.location.reload()

//       }
//     } catch (err) {
//       toast.error("Failed to delete")
//       console.error(err)
//     }
//   }

//     return(
//         <Button variant="destructive" className="mt-1 cursor-pointer rounded-none" onClick={() => handleDelete(id)}>
//             Delete
//         </Button>
//     )
// }



"use client"

import { deleteApp, deletePost } from "@/actions/admin"
import { useState } from "react"
import { toast } from "sonner"

interface DeletePostOrAppProps {
  id: string
  type: "post" | "app"
}

export default function DeletePostOrApp({ id, type }: DeletePostOrAppProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      if(type==="post")
      {
        await deletePost(id)
        toast.success("Deleted successfully")
        window.location.reload()
      }
      if(type==="app"){
        await deleteApp(id)
        toast.success("Deleted successfully")
        window.location.reload()

      }
    } catch (err) {
      toast.error("Failed to delete")
      setLoading(false)
      console.error(err)
    }
    }


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 bg-red-500 text-white py-1 px-2 text-center"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-950 p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this {type}? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="py-1 px-3 bg-zinc-700 hover:bg-zinc-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={()=>{handleDelete(id)}}
                disabled={loading}
                className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
