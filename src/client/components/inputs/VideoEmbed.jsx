import React from 'react'

const VideoEmbed = ({ videoUrl }) => {

  // const videoContainerStyle = {
  //   border: '1px solid #000', 
  // };

  return (
    // <div className="video-container" style={videoContainerStyle}>
    <div className="video-container" >
    <iframe
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
