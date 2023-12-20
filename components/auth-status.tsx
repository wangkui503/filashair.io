import GetServerSession from "@/lib/session";
export default async function AuthStatus() {
  const session = await GetServerSession();
  return (
    <div className="-z-50 absolute top-5 w-full flex justify-center items-center">
      {session && (
        <p className="text-stone-200 text-sm">
          Signed in as {session.user?.email} ({session.user?.role})
        </p>
      )}
      <div className="ml-4 flex justify-center opacity-25">
        <img className="w-5 h-5" src="/air.svg"/>      
      </div>
    </div>
  );
}
