import { DeleteIcon } from "../../icons/DeleteIcon";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

// TypeScript declaration for Twitter widget
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface TwitterContent {
  _id?: string;
  id?: string;
  title: string;
  link: string;
  type: "twitter";
}

interface TwitterScrollContainerProps {
  twitterContent: TwitterContent[];
  onDelete?: (contentId: string | number) => void;
}

export function TwitterScrollContainer({ twitterContent, onDelete }: TwitterScrollContainerProps) {
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance for swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset on new touch
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      scrollRight();
    }
    if (isRightSwipe) {
      scrollLeft();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRight();
    }
  };

  useEffect(() => {
    // Load Twitter widgets
    const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    }
    
    const loadWidgets = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    };
    
    if (window.twttr) {
      loadWidgets();
    } else {
      setTimeout(loadWidgets, 1000);
    }
  }, [twitterContent]);

  const handleDelete = async (e: React.MouseEvent, contentId: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) return;
    
    if (window.confirm("Are you sure you want to delete this Twitter post?")) {
      setDeletingId(contentId);
      try {
        await onDelete(contentId);
      } catch (error) {
        console.error("Error deleting Twitter content:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('twitter-scroll-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('twitter-scroll-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (twitterContent.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FontAwesomeIcon 
            icon={faXTwitter} 
            className="text-blue-500 text-xl mr-3" 
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Twitter Posts ({twitterContent.length})
          </h2>
        </div>
        
        {/* Scroll Controls */}
        <div className="flex gap-2 twitter-scroll-controls">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Scroll left"
            aria-label="Scroll Twitter posts left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Scroll right"
            aria-label="Scroll Twitter posts right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Screen reader instructions */}
      <div id="twitter-scroll-instructions" className="sr-only">
        Use arrow keys to scroll through Twitter posts horizontally, or swipe on mobile devices.
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div 
          id="twitter-scroll-container"
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Twitter posts horizontal scroll container"
          aria-describedby="twitter-scroll-instructions"
        >
          {twitterContent.map((content, index) => {
            const contentId = content._id || content.id || index;
            const isDeleting = deletingId === contentId;
            
            return (
              <div 
                key={contentId}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="flex-shrink-0 mr-3">
                        <FontAwesomeIcon 
                          icon={faXTwitter} 
                          className="text-blue-500 text-lg" 
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {content.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <a 
                        href={content.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                        title="Open on Twitter"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      {onDelete && (
                        <button
                          onClick={(e) => handleDelete(e, contentId)}
                          disabled={isDeleting}
                          className={`p-1 transition-colors duration-200 ${
                            isDeleting 
                              ? "text-gray-400 cursor-not-allowed" 
                              : "text-gray-500 hover:text-red-600"
                          }`}
                          title="Delete Twitter post"
                        >
                          <DeleteIcon size="sm" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Twitter Content */}
                <div className="h-96 bg-gray-50 flex items-center justify-center">
                  <div className="w-full h-full overflow-y-auto overflow-x-hidden p-3 bg-white">
                    <div className="text-xs text-gray-500 mb-2 text-center">
                      ↕️ Scroll to view full tweet
                    </div>
                    <blockquote className="twitter-tweet" data-theme="light">
                      <a href={content.link.replace("x.com", "twitter.com")}>
                        Loading Tweet...
                      </a>
                    </blockquote>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Twitter Post
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
} 