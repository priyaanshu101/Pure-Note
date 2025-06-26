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
import { Navbar } from './Navbar'

function UserBoard() {
  const [openAddContent, setOpenAddContent] = useState(false)
  const [openShareContent, setOpenShareContent] = useState(false)
  const [contentList, setContentList] = useState([])
  const [selectedType, setSelectedType] = useState('All Content')

  const token = localStorage.getItem('token')

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
  }

  const filteredContent =
    selectedType === 'All Content'
      ? contentList
      : contentList.filter((item) => item.type === selectedType)

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

  return (
    <>
      <Sidebar specificContent={handleSidebarSelect} />

      <div className="ml-60 pl-10 bg-[#faf7fe] min-h-screen h-screen pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex gap-3 items-center justify-end p-6 pb-10">
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
            onClick={() => setOpenShareContent(true)}
            text="Share Brain"
          />
        </div>

        <div className="grid grid-cols-4 gap-8">
          {filteredContent.map(
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
          <CreateShareModal open={openShareContent} onCloseShare={() => setOpenShareContent(false)} />
        )}
      </div>
    </>
  )
}

export default UserBoard;
