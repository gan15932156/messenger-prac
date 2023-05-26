import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoptions } from "../../auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const splitdata = body.split("&");
    const socket_id = splitdata[0].split("=");
    const channel_name = splitdata[1].split("=");

    const session = await getServerSession(authoptions);
    if (!session?.user?.email) {
      return new NextResponse("dasdsad", { status: 401 });
    }
    const data = {
      user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(
      socket_id[1],
      channel_name[1],
      data
    );
    return NextResponse.json(authResponse);
  } catch (error: any) {
    console.log(error, "ERROR");
    return new NextResponse("ERROR " + error, { status: 500 });
  }
}
