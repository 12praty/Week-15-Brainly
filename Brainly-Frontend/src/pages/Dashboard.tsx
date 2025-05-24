import "../App.css";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { TwitterScrollContainer } from "../components/ui/TwitterScrollContainer";
import { PlusIcon } from "../icons/PlusIcon";
import { useState, useMemo } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { useContent } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contentFilter, setContentFilter] = useState<"all" | "youtube" | "twitter">("all");
  const { contents, refresh, deleteContent, loading } = useContent();
  const navigate = useNavigate();

  const filteredContents = useMemo(() => {
    if (contentFilter === "all") return contents;
    return contents.filter((content: any) => content.type === contentFilter);
  }, [contents, contentFilter]);

  // Separate Twitter and YouTube content for different layouts
  const twitterContent = useMemo(() => {
    return contents.filter((content: any) => content.type === "twitter");
  }, [contents]);

  const youtubeContent = useMemo(() => {
    return contents.filter((content: any) => content.type === "youtube");
  }, [contents]);

  const handleFilterChange = (filter: "all" | "youtube" | "twitter") => {
    setContentFilter(filter);
  };

  const handleContentAdded = () => {
    refresh();
  };

  const handleDeleteContent = async (contentId: string | number) => {
    try {
      await deleteContent(contentId);
    } catch (error: any) {
      console.error("Dashboard: Delete failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete content. Please try again.";
      alert(`Delete failed: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getHeaderTitle = () => {
    switch(contentFilter) {
      case "youtube": return "YouTube Videos";
      case "twitter": return "Twitter Posts";
      default: return "All Content";
    }
  };

  const getEmptyMessage = () => {
    switch(contentFilter) {
      case "youtube": return "No YouTube videos available. Add some content to get started.";
      case "twitter": return "No Twitter posts available. Add some content to get started.";
      default: return "Start by adding your first YouTube video or Twitter post.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          onFilterChange={handleFilterChange}
          activeFilter={contentFilter}
        />

        {/* Main Content */}
        <div className="flex-1 ml-72 p-6">
          <CreateContentModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={handleContentAdded}
          />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getHeaderTitle()}
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? "Loading..." : `${filteredContents.length} ${filteredContents.length === 1 ? 'item' : 'items'}`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setModalOpen(true)}
                startIcon={<PlusIcon size={"lg"} />}
                size="sm"
                variant="primary"
                text="Add Content"
              />
              <Button
                onClick={handleLogout}
                size="sm"
                variant="secondary"
                text="Logout"
              />
            </div>
          </div>

          {/* Content Display */}
          {filteredContents.length > 0 ? (
            <div>
              {/* Show Twitter horizontal scroll when viewing all content or just Twitter */}
              {(contentFilter === "all" || contentFilter === "twitter") && twitterContent.length > 0 && (
                <TwitterScrollContainer 
                  twitterContent={twitterContent}
                  onDelete={handleDeleteContent}
                />
              )}

              {/* Show YouTube grid when viewing all content or just YouTube */}
              {(contentFilter === "all" || contentFilter === "youtube") && youtubeContent.length > 0 && (
                <div className="mb-8">
                  {contentFilter === "all" && youtubeContent.length > 0 && (
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 mr-3 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        YouTube Videos ({youtubeContent.length})
                      </h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(contentFilter === "youtube" ? filteredContents : youtubeContent).map((content: any, index: number) => (
                      <Card 
                        key={content._id || content.id || index}
                        type={content.type} 
                        link={content.link} 
                        title={content.title}
                        contentId={content._id || content.id}
                        onDelete={handleDeleteContent}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show filtered content in grid when filter is set to twitter only */}
              {contentFilter === "twitter" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredContents.map((content: any, index: number) => (
                    <Card 
                      key={content._id || content.id || index}
                      type={content.type} 
                      link={content.link} 
                      title={content.title}
                      contentId={content._id || content.id}
                      onDelete={handleDeleteContent}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600 mb-6">
                {getEmptyMessage()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
