export default function AddTransactionDialog() {
  return (
    <section className="w-full min-h-full bg-neutral-700/50 z-50 fixed backdrop-blur-xs p-3 flex items-center justify-center">
      <div className="w-[380px] h-[490px] bg-white rounded-2xl px-5 py-4 border-3 border-neutral-700/30">
        <h2 className="text-lg font-medium">Add Transaction</h2>
        <div>
          <form className="flex flex-col gap-4 py-4">
            {/* name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm text-neutral-500 font-medium "
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Food"
                className="border border-neutral-300 p-2 rounded-lg text-sm outline-none "
              />
            </div>
            {/* price */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-sm text-neutral-500 font-medium "
              >
                Price
              </label>
              <input
                name="price"
                type="text"
                placeholder="0.00"
                className="border border-neutral-300 p-2 rounded-lg text-sm outline-none "
              />
            </div>
            {/* mode */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="mode"
                className="text-sm text-neutral-500 font-medium "
              >
                Mode
              </label>
              <div className="border border-neutral-300 p-2 rounded-lg text-sm">
                <select id="mode-select" className="w-full outline-none">
                  <option value={"cash"} className="bg-white p-4 w-full">
                    Cash
                  </option>
                  <option value={"upi"} className="bg-white p-4 w-full">
                    UPI
                  </option>
                </select>
              </div>
            </div>
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-sm text-neutral-500 font-medium "
              >
                Category
              </label>
              <div className="border border-neutral-300 p-2 rounded-lg text-sm">
                <select id="category" className="w-full outline-none">
                  <option value={"food"} className="bg-white p-4 w-full">
                    Food
                  </option>
                  <option value={"shopping"} className="bg-white p-4 w-full">
                    Shopping
                  </option>
                </select>
              </div>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}
