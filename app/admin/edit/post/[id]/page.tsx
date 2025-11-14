import EditPost from "./editPost";

export default function Page({ params }: { params: { id: string } }) {
  return <EditPost postId={params.id} />
}
