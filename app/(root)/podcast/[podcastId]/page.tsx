import React from 'react'

const PodcastDetails = ({params:{podcastId}}:{params:{podcastId: string}}) => {
  return (
    <div>
      <p className='text-white-1'>PodcastDetails for {podcastId}</p>
    </div>
  )
}

export default PodcastDetails
