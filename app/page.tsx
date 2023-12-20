import Link from "next/link";

export default function Home() {
  return (
    <div className="flex">
      <div className="w-screen flex flex-col justify-center items-center">
        <a href="/air">
        <img
          src="/logo.svg"
          alt="A product of filash.io"
          className="w-72 h-72"
        />
        </a>
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-stone-400 font-bold text-2xl">
            A product of {" "}
            <a
              href="https://filash.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-stone-200 transition-all"
            >filash.io</a>
            <br/>
            Distance no longer matters
          </h1>
          <p className="text-stone-400 mt-5">
            This is the web application powered by{" "}
            <a
              href="https://filash.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >filash.io</a>{" "}
            with the next generation end-to-end long distance file transfer technologies that enable 
            users upload and download any file set globally regardless distance and network conditions.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-x-3">
          <Link
            href="/air"
            prefetch={false} // workaround until https://github.com/vercel/vercel/pull/8978 is deployed
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashAir
          </Link>
          <p className="text-white">·</p>
          <a
            href="https://filash.io/arc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashArc
          </a>
          <p className="text-white">·</p>
          <a
            href="https://filash.io/satellite"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashAtellite
          </a>
          <p className="text-white">·</p>
          <a
            href="https://filash.io/arm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashArm
          </a>
          <p className="text-white">·</p>
          <a
            href="https://filash.io/saas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashaaS
          </a>
          <p className="text-white">·</p>
          <a
            href="https://filash.io/ahi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            filashAHI
          </a>          
        </div>
      </div>
    </div>
  );
}
