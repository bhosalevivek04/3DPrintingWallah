import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-stone-200 border-t-amber-600 animate-spin" />
      </div>
      <p className="text-xs font-medium text-stone-600 tracking-wider uppercase animate-pulse">
        Loading Workshop Content...
      </p>
    </div>
  );
}
