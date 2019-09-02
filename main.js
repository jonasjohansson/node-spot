const applescript = require('applescript');
const appName = 'Audio Hijack Pro';

const script = `
-- Version 0.6
-- New In 0.5
-- Delay time is now in milliseconds
-- Unused vars deleted
-- New in 0.6
-- Saves artwork as comment
-- Original here: https://github.com/alexjohnj/spotijack/

set delay_time to 0.1

set old_track_id to ""

display alert "Instructions: Launch Audio Hijack & Hijack Spotify. Then, find a song in Spotify and play then pause it. Then click Ready!" buttons {"Quit", "Ready!"}
set choice to button returned of the result
if choice is "Quit" then
  tell me to quit
end if

tell application "Audio Hijack Pro"
  set theSession to first session whose name is "Spotify"
  start hijacking theSession relaunch yes
  start recording theSession
end tell

set smallDelay to 0.3 -- Needed to let AH start recording? Check this...
delay smallDelay

tell application "Spotify" to set player position to 0
tell application "Spotify" to play current track

repeat
  try
    set boolStarted to false
    set boolPaused to false
    
    --main crap
    
    tell application "Spotify" to set track_id to id of current track
    tell application "Spotify" to set theState to player state as string
    
    if theState is "paused" then tell application "Audio Hijack Pro" to pause recording theSession
    if theState is "playing" then tell application "Audio Hijack Pro" to unpause recording theSession
    
    if theState is "stopped" then tell application "Audio Hijack Pro"
      stop recording theSession
      stop hijacking theSession
      tell me to quit
    end tell
    
    if (old_track_id is not track_id) then
      tell application "Spotify" to pause current track
      
      tell application "Audio Hijack Pro" to stop recording theSession
      tell application "Audio Hijack Pro" to stop hijacking theSession
      
      tell application "Spotify"
        set cAlbum to album of current track
        set cArtist to artist of current track
        set cDiscNum to disc number of current track
        set cDuration to duration of current track
        set cTrackNum to track number of current track
        set cName to name of current track
        set cAlbumArtist to album artist of current track
        set cArtwork to artwork url of current track
      end tell
      
      tell application "Audio Hijack Pro"
        set album tag of theSession to cAlbum
        set album artist tag of theSession to cAlbumArtist
        set artist tag of theSession to cArtist
        set title tag of theSession to cName
        set track number tag of theSession to cTrackNum
        set disc number tag of theSession to cDiscNum
        set comment tag of theSession to cArtwork
        start hijacking theSession
        start recording theSession
      end tell
      
      delay delay_time
      tell application "Spotify" to play current track
    end if
    
    set old_track_id to track_id
    tell application "Spotify"
      set trackLength to duration of current track
      set currentTime to player position
    end tell
  end try
  delay delay_time
end repeat`;

applescript.execString(script, (err, rtn) => {
  if (err) {
    // Something went wrong!
  }
  console.log(rtn);
});
