// import { useState, useEffect } from 'react'
// import axios from 'axios'

// import { Button } from '../components/UI/Button'
// import { PlusIcon } from '../icons/PlusIcon'
// import { ShareIcon } from '../icons/ShareIcon'
// import { Card } from '../components/UI/Card'
// import { NotesIcon } from '../icons/NotesIcon'
// import { TwitterIcon } from '../icons/TwitterIcon'
// import { YoutubeIcon } from '../icons/YoutubeIcon'
// import { CreateContentModal } from '../components/UI/CreateContentModal'
// import { Sidebar } from '../components/UI/Sidebar'
// import { CreateShareModal } from '../components/UI/CreateShareModal'
// import { InstaIcon } from '../icons/InstaIcon'
// import { LinkIcon } from '../icons/LinkIcon'
// import { MusicIcon } from '../icons/MusicIcon'
// import { SearchComponent } from '../components/UI/SearchComponent'

// function UserBoard() {
//   const [openAddContent, setOpenAddContent] = useState(false)
//   const [shareContentType, setShareContentType] = useState("")
//   const [openShareContent, setOpenShareContent] = useState(false)
//   const [contentList, setContentList] = useState([])
//   const [selectedType, setSelectedType] = useState('All Content')
//   const [shareContentHash, setShareContentHash] = useState("")
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [isMobile, setIsMobile] = useState(false)
//   const token = localStorage.getItem('token')

//   // Check if screen is mobile size
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 768
//       setIsMobile(mobile)
//       // Auto-hide sidebar on mobile
//       if (mobile && sidebarOpen) {
//         setSidebarOpen(false)
//       }
//       // Auto-show sidebar on desktop if it was hidden due to mobile
//       if (!mobile && !sidebarOpen) {
//         setSidebarOpen(true)
//       }
//     }

//     checkScreenSize()
//     window.addEventListener('resize', checkScreenSize)
//     return () => window.removeEventListener('resize', checkScreenSize)
//   }, [])

//   const fetchContent = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:3000/api/v1/contents', {
//         headers: { Authorization: token }
//       })
//       setContentList(data)
//     } catch {
//       alert('Error loading content')
//     }
//   }

//   const checkPublicPrivate = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:3000/api/v1/brain/public_OR_private', {
//         headers: { Authorization: token }
//       })
//       setOpenShareContent(true)
//       setShareContentType(data.type)
//       setShareContentHash(data.hash)
//     } catch (e) {
//       alert('Error fetching Public or Private')
//     }
//   }

//   useEffect(() => {
//     fetchContent()
//   }, [])

//   const deleteContent = async (id) => {
//     try {
//       await axios.delete('http://localhost:3000/api/v1/deleteContent', {
//         headers: { Authorization: token },
//         params: { id }
//       })
//       fetchContent()
//     } catch {
//       alert('Error deleting content')
//     }
//   }

//   const handleSidebarSelect = (title) => {
//     setSelectedType(title)
//     // Close sidebar on mobile after selection
//     if (isMobile) {
//       setSidebarOpen(false)
//     }
//   }

//   const filteredContent =
//     selectedType === 'All Content'
//       ? contentList
//       : contentList.filter((item) => item.type === selectedType)

//   const getIcon = (type) => {
//     switch (type) {
//       case 'Youtube':
//         return <YoutubeIcon size="md" />
//       case 'Twitter':
//         return <TwitterIcon size="md" />
//       case 'Instagram':
//         return <InstaIcon size="md" />
//       case 'Notes':
//         return <NotesIcon size="md" />
//       case 'Link':
//         return <LinkIcon size="md" />
//       case 'Music':
//         return <MusicIcon size="md" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 flex">
//       {/* Sidebar */}
//       <Sidebar 
//         specificContent={handleSidebarSelect} 
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         isMobile={isMobile}
//       />

//       {/* Mobile overlay */}
//       {isMobile && sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
//         !sidebarOpen ? 'ml-0' : ''
//       }`}>
        
//         {/* Menu button - shows when sidebar is hidden */}
//         {!sidebarOpen && (
//           <button
//             className="fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         )}

//         {/* Header with buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 sm:p-6 pt-16 sm:pt-6">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold text-gray-800">
//               {selectedType}
//             </h1>
//             <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
//               {filteredContent.length} items
//             </span>
//           </div>
          
//           <div className="flex gap-3 flex-shrink-0">
//             <SearchComponent/>
//             <Button
//               startIcon={<PlusIcon size="md" />}
//               variant="secondary"
//               size="sm"
//               onClick={() => setOpenAddContent(true)}
//               text="Add Content"
//             />
//             <Button
//               startIcon={<ShareIcon size="md" />}
//               variant="primary"
//               size="sm"
//               onClick={() => checkPublicPrivate()}
//               text="Share Brain"
//             />
//           </div>
//         </div>

//         {/* Content grid */}
//         <div className="px-4 sm:px-6 pb-6">
//           {filteredContent.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-500 text-lg mb-2">No content found</div>
//               <div className="text-gray-400 text-sm">
//                 {selectedType === 'All Content' 
//                   ? 'Start by adding some content to your brain!' 
//                   : `No ${selectedType.toLowerCase()} content found. Try adding some!`
//                 }
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
//               {filteredContent.map(
//                 (item) =>
//                   item.link && (
//                     <Card
//                       key={item._id.toString()}
//                       startIcon={getIcon(item.type)}
//                       title={item.title}
//                       type={item.type}
//                       link={item.link}
//                       onClickDelete={() => deleteContent(item._id)}
//                     />
//                   )
//               )}
//             </div>
//           )}
//         </div>

//         {/* Modals */}
//         {openAddContent && (
//           <CreateContentModal
//             open={openAddContent}
//             onClose={() => {
//               setOpenAddContent(false)
//               fetchContent()
//             }}
//           />
//         )}

//         {openShareContent && (
//           <CreateShareModal
//             open={openShareContent}
//             type={shareContentType}
//             onCloseShare={() => setOpenShareContent(false)}
//             onUpdateType={(newType) => setShareContentType(newType)}
//             existingHash={shareContentHash}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserBoard

import { useState, useEffect } from 'react'
import axios from 'axios'

import { Button } from '../components/UI/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../components/UI/Card'
import { NotesIcon } from '../icons/NotesIcon'
import { TwitterIcon } from '../icons/TwitterIcon'
import { YoutubeIcon } from '../icons/YoutubeIcon'
import { CreateContentModal } from '../components/UI/CreateContentModal'
import { Sidebar } from '../components/UI/Sidebar'
import { CreateShareModal } from '../components/UI/CreateShareModal'
import { InstaIcon } from '../icons/InstaIcon'
import { LinkIcon } from '../icons/LinkIcon'
import { MusicIcon } from '../icons/MusicIcon'
import { SearchComponent } from '../components/UI/SearchComponent'

function UserBoard() {
  const [openAddContent, setOpenAddContent] = useState(false)
  const [shareContentType, setShareContentType] = useState("")
  const [openShareContent, setOpenShareContent] = useState(false)
  const [contentList, setContentList] = useState([])
  const [selectedType, setSelectedType] = useState('All Content')
  const [shareContentHash, setShareContentHash] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const token = localStorage.getItem('token')

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-hide sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false)
      }
      // Auto-show sidebar on desktop if it was hidden due to mobile
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const fetchContent = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/v1/contents', {
        headers: { Authorization: token }
      })
      setContentList(data)
    } catch {
      alert('Error loading content')
    }
  }

  const checkPublicPrivate = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/v1/brain/public_OR_private', {
        headers: { Authorization: token }
      })
      setOpenShareContent(true)
      setShareContentType(data.type)
      setShareContentHash(data.hash)
    } catch (e) {
      alert('Error fetching Public or Private')
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const deleteContent = async (id) => {
    try {
      await axios.delete('http://localhost:3000/api/v1/deleteContent', {
        headers: { Authorization: token },
        params: { id }
      })
      fetchContent()
    } catch {
      alert('Error deleting content')
    }
  }

  const handleSidebarSelect = (title) => {
    setSelectedType(title)
    // Close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results)
    setIsSearchActive(true)
  }

  // Handle search clear
  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearchActive(false)
  }

  // Get the content to display based on search state
  const getDisplayContent = () => {
    if (isSearchActive && searchResults.length > 0) {
      // When searching, show only search results
      return searchResults
    } else if (isSearchActive && searchResults.length === 0) {
      // When searching but no results, show empty array
      return []
    } else {
      // Normal filtering by type
      return selectedType === 'All Content'
        ? contentList
        : contentList.filter((item) => item.type === selectedType)
    }
  }

  const displayContent = getDisplayContent()

  const getIcon = (type) => {
    switch (type) {
      case 'Youtube':
        return <YoutubeIcon size="md" />
      case 'Twitter':
        return <TwitterIcon size="md" />
      case 'Instagram':
        return <InstaIcon size="md" />
      case 'Notes':
        return <NotesIcon size="md" />
      case 'Link':
        return <LinkIcon size="md" />
      case 'Music':
        return <MusicIcon size="md" />
      default:
        return null
    }
  }

  const getHeaderTitle = () => {
    if (isSearchActive) {
      return 'Search Results'
    }
    return selectedType
  }

  const getEmptyStateMessage = () => {
    if (isSearchActive) {
      return {
        title: 'No search results found',
        subtitle: 'Try adjusting your search terms or search for different content.'
      }
    }
    
    return {
      title: 'No content found',
      subtitle: selectedType === 'All Content' 
        ? 'Start by adding some content to your brain!' 
        : `No ${selectedType.toLowerCase()} content found. Try adding some!`
    }
  }

  const emptyState = getEmptyStateMessage()

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 flex">
      {/* Sidebar */}
      <Sidebar 
        specificContent={handleSidebarSelect} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
        !sidebarOpen ? 'ml-0' : ''
      }`}>
        
        {/* Menu button - shows when sidebar is hidden */}
        {!sidebarOpen && (
          <button
            className="fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 sm:p-6 pt-16 sm:pt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {getHeaderTitle()}
            </h1>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              {displayContent.length} items
            </span>
            {/* Search active indicator */}
            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 
                           px-2 py-1 rounded-full transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <SearchComponent
              onSearchResults={handleSearchResults}
              onClearSearch={handleClearSearch}
            />
            <Button
              startIcon={<PlusIcon size="md" />}
              variant="secondary"
              size="sm"
              onClick={() => setOpenAddContent(true)}
              text="Add Content"
            />
            <Button
              startIcon={<ShareIcon size="md" />}
              variant="primary"
              size="sm"
              onClick={() => checkPublicPrivate()}
              text="Share Brain"
            />
          </div>
        </div>

        {/* Content grid */}
        <div className="px-4 sm:px-6 pb-6">
          {displayContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">{emptyState.title}</div>
              <div className="text-gray-400 text-sm">
                {emptyState.subtitle}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {displayContent.map(
                (item) =>
                  item.link && (
                    <Card
                      key={item._id.toString()}
                      startIcon={getIcon(item.type)}
                      title={item.title}
                      type={item.type}
                      link={item.link}
                      onClickDelete={() => deleteContent(item._id)}
                    />
                  )
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {openAddContent && (
          <CreateContentModal
            open={openAddContent}
            onClose={() => {
              setOpenAddContent(false)
              fetchContent()
            }}
          />
        )}

        {openShareContent && (
          <CreateShareModal
            open={openShareContent}
            type={shareContentType}
            onCloseShare={() => setOpenShareContent(false)}
            onUpdateType={(newType) => setShareContentType(newType)}
            existingHash={shareContentHash}
          />
        )}
      </div>
    </div>
  )
}

export default UserBoard