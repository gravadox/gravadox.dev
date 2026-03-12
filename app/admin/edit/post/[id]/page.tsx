import EditPost from "./editPost";

export default async function Page({ params }: { params: { id: string } }) {
  const {id} = await params
  return <EditPost postId={id} />
}
