import React from "react";
import Button from "../ui/Button";

const LoadMore = ({ hasMore, onLoadMore, isLoading }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading}
        className="w-full sm:w-auto min-w-[200px]"
      >
        {isLoading ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
};

export default LoadMore;
