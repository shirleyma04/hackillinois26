function AudioPlayer({ src }) {
  if (!src) {
    return null
  }

  return (
    <div style={{ marginTop: 10 }}>
      <audio controls src={src} style={{ width: '100%' }}>
        Your browser does not support audio playback.
      </audio>
    </div>
  )
}

export default AudioPlayer