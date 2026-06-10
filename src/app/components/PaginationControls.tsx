interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollTargetId?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  scrollTargetId,
}: PaginationControlsProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);

    if (!scrollTargetId) return;

    window.requestAnimationFrame(() => {
      document.getElementById(scrollTargetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="mt-4 flex items-center justify-between pr-24 sm:pr-28 text-sm text-gray-600">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
