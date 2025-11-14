import EditApp from "./editApp";

export default function Page({ params }: { params: { id: string } }) {
  return <EditApp appId={params.id}  />
}
