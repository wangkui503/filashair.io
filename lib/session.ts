import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function GetServerSession() {
    return await getServerSession(authOptions);
}