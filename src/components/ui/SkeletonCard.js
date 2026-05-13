// SkeletonCard — use on browse page and profile page project grids
export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      {/* header row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-4">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>

      {/* description lines */}
      <div className="space-y-2 mb-4">
        <div className="h-3.5 bg-gray-200 rounded w-full"></div>
        <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3.5 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* owner row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        <div className="h-3.5 bg-gray-200 rounded w-24"></div>
      </div>

      {/* tech stack tags */}
      <div className="flex gap-2 mb-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>

      {/* role tags */}
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-28"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </div>
    </div>
  )
}

// SkeletonRow — use on dashboard project list
export function SkeletonRow() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-14"></div>
            <div className="h-5 bg-gray-200 rounded-full w-18"></div>
            <div className="h-5 bg-gray-200 rounded-full w-12"></div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <div className="h-8 bg-gray-200 rounded-lg w-14"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-14"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
        </div>
      </div>
    </div>
  )
}

// SkeletonRequestCard — use on dashboard incoming requests
export function SkeletonRequestCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-3 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-1.5"></div>
          <div className="h-3.5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        <div className="h-5 bg-gray-200 rounded-full w-14"></div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 bg-gray-200 rounded w-full"></div>
        <div className="h-3.5 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  )
}

// SkeletonProfile — use on public profile page header
export function SkeletonProfile() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-5 mb-5">
        <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-28 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-full"></div>
            <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        <div className="h-6 bg-gray-200 rounded-full w-18"></div>
      </div>
    </div>
  )
}

// SkeletonDetailPage — use on project detail page
export function SkeletonDetailPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-full"></div>
            <div className="h-3.5 bg-gray-200 rounded w-full"></div>
            <div className="h-3.5 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1.5"></div>
              <div className="h-3.5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  )
}