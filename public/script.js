const socket = io('/');
const videoGrid = document.getElementById('video-grid'); // display the videos
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});
const myVideo = document.createElement('video'); // my video
myVideo.muted = true; // mute video of myself

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
  });

myPeer.on('open', (id) => {
  // getting user room id and user id in the room
  socket.emit('join-room', ROOM_ID, id);
});

// listen the event
socket.on('user-connected', (userId) => {
  console.log(`${userId} is connected`);
});

// helper functions
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  // as soon as the media is loaded
  video.addEventListener('loadedmetadata', () => {
    video.play(); // play the video
  });
  videoGrid.append(video);
};
