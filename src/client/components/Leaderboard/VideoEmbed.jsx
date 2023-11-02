import React from 'react'

const VideoEmbed = ({ videoUrl }) => {

  return (
    <div className="video-container">
    <iframe  style={{border: "none"}}
      width="350"
      height="196"
      src={`https://www.youtube.com/embed/${videoUrl}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
  )
}

export default VideoEmbed
