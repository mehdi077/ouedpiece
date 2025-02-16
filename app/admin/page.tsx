
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";

export default async function Admin() {
    const { userId } = await auth();
    if (!userId) redirect("/");
    if (userId !== "user_2slKGFcgpBz0nWC9nQvTaHJMZhG") redirect("/");
    
    

    return (
        <div className='flex min-h-screen w-full bg-[#383838] justify-center'>
            <AdminPanel />
        </div>
    )
    
}
