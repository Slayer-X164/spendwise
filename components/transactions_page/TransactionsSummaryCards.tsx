export default function TransactionSummaryCards() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row flex-wrap">
      {/* total spent card */}
      <div className="flex-1 p-3 bg-neutral-50 rounded-xl border-neutral-300/70 border gap-3 flex flex-col">
        <h3 className="capitalize text-sm font-medium tracking-wider text-neutral-500">
          total spent
        </h3>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl">
            {Number(140490).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            })}
          </h2>
          <h3 className="text-xs px-3 py-1 bg-neutral-200 border-neutral-300 border rounded-md text-neutral-600 capitalize">
            all categories
          </h3>
        </div>
      </div>

      {/* Number of Transactions card */}
      <div className="flex-1 p-3 bg-neutral-50 rounded-xl border-neutral-300/70 border gap-3 flex flex-col">
        <h3 className="capitalize text-sm font-medium tracking-wider text-neutral-500">
          transactions
        </h3>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl">14</h2>
          <h3 className="text-xs px-3 py-1 bg-neutral-200 border-neutral-300 border rounded-md text-neutral-600 capitalize">
            all modes
          </h3>
        </div>
      </div>

      {/* total spent card */}
      <div className="flex-1 p-3 bg-neutral-50 rounded-xl border-neutral-300/70 border gap-3 flex flex-col">
        <h3 className="capitalize text-sm font-medium tracking-wider text-neutral-500">
          Largest expense
        </h3>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl">
            {Number(19000).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            })}
          </h2>
          <h3 className="text-xs px-3 py-1 bg-neutral-200 border-neutral-300 border rounded-md text-neutral-600 capitalize">
            electronics
          </h3>
        </div>
      </div>
    </div>
  );
}