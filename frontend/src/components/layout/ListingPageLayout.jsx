import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp } from "../../animations/motionVariants";
import MobileFilterToggle from "../ui/MobileFilterToggle";
import LoadMore from "../common/LoadMore";

const ListingPageLayout = ({
  title,
  subtitle,
  isSidebarOpen,
  onSidebarToggle,
  sidebarContent,
  loading,
  items,
  renderItem,
  skeletonCount = 6,
  renderSkeleton,
  emptyStateContent,
  breakpoint = "lg", // "md" or "lg"
  gridCols = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  pagination,
  onLoadMore,
  isLoadingMore,
}) => {
  const isLg = breakpoint === "lg";

  // Dynamic classes based on breakpoint
  const wrapperClass = `flex flex-col ${isLg ? "lg:flex-row" : "md:flex-row"} gap-8 items-start`;
  
  const sidebarClass = `
    ${isSidebarOpen ? "block" : isLg ? "hidden lg:block" : "hidden md:block"}
    ${isLg ? "lg:sticky" : "md:sticky"} 
    top-24 w-full ${isLg ? "lg:w-1/4" : "md:w-64 lg:w-72"} shrink-0 self-start
  `;

  const toggleClass = `${isLg ? "lg:hidden" : "md:hidden"} mb-6`;
  const mainClass = `w-full ${isLg ? "lg:w-3/4" : "flex-1"}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <MobileFilterToggle 
          isOpen={isSidebarOpen} 
          onToggle={onSidebarToggle} 
          className={toggleClass} 
        />

        <div className={wrapperClass}>
          
          {/* Sidebar Filters */}
          <div className={sidebarClass}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              {sidebarContent}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={mainClass}>
            {loading ? (
              <div className={`grid ${gridCols} gap-6`}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <React.Fragment key={i}>
                    {renderSkeleton()}
                  </React.Fragment>
                ))}
              </div>
            ) : items.length === 0 ? (
              emptyStateContent
            ) : (
              <>
                <motion.div 
                  variants={stagger} 
                  initial="hidden" 
                  animate="show" 
                  className={`grid ${gridCols} gap-6`}
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        layout
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item._id || index}
                        className="h-full flex flex-col"
                      >
                        {renderItem(item)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination / Load More */}
                {pagination?.hasMore && (
                  <div className="mt-12 flex justify-center">
                    <LoadMore 
                      hasMore={pagination.hasMore}
                      onLoadMore={onLoadMore}
                      isLoading={isLoadingMore}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ListingPageLayout;
