import { generateParticiaptionToken } from "@/server/actions";
import { LiveRoom } from "@/app/_components/LiveRoom";
export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
  const token = await generateParticiaptionToken(params.id);
  if (!token) return null;
  return (
    <LiveRoom token={token} />
  );
}
