export default function TabLoading(){
  return (
    <div className="w-full h-[80%] flex items-center justify-center ">
      <div className="flex  items-center justify-center flex-col-reverse gap-3">
        <h2 className="text-neutral-500 text-md">Loading Tab...</h2>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-l-neutral-600"></div>
      </div>
    </div>
  )
}