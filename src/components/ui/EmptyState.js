import Link from 'next/link'

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    // <div className="flex flex-col items-center justify-center text-center p-10">
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-14 text-center">

      {/* Icon / Illustration Placeholder */}
      <div className="text-6xl mb-4">
        📭
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {/* Navigation Action */}
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}

      {/* Non-navigation Action */}
      {!actionHref && onAction && actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;