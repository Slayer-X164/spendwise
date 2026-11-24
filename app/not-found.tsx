import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-dvh  flex flex-col items-center justify-center gap-4 text-center px-3 bg-radial from-white to-blue-100">
      <h2 className={`text-3xl sm:text-6xl  font-medium text-blue-600`}>404</h2>
      <h3 className="capitalize text-4xl sm:text-6xl">Oops! page not found</h3>
      <h4 className="max-w-lg text-center text-neutral-500 mb-4 sm:py-4 text-sm sm:text-lg ">
        The page you are looking for does not exist, click button below to go
        back to home page
      </h4>
      <button>
        <Link
          href={"/"}
          className="capitalize px-10  py-3 rounded-lg bg-radial from-blue-700 to-blue-400 text-neutral-50"
        >
          back to home
        </Link>
      </button>
    </div>
  );
}
