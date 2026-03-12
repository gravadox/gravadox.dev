import EditApp from "./editApp";

export default async function Page({ params }: { params: { id: string } }) {
  const {id} = await params
  return <EditApp appId={id}  />
}
