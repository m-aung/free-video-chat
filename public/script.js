const socket = io('/');
const videoGrid = document.getElementById('video-grid'); // display the videos
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});
const myVideo = document.createElement('video'); // my video
myVideo.muted = true; // mute video of myself

const peers = {}; // storing user ids
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream); // streaming my video
    // answer the call
    myPeer.on('call', (call) => {
      call.answer(stream); // answer the call
      const video = document.createElement('video'); // create a new video element
      // stream the video
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    // user is connected
    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });

myPeer.on('open', (id) => {
  // getting user room id and user id in the room
  socket.emit('join-room', ROOM_ID, id);
});

// listen the event testing
// socket.on('user-connected', (userId) => {
//   console.log(`${userId} is connected`);
// });

socket.on('user-disconnected', (userId) => {
  console.log(userId);
});

// helper functions
// for video streaming two paraments video element and stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  // as soon as the media is loaded
  video.addEventListener('loadedmetadata', () => {
    video.play(); // play the video
  });
  videoGrid.append(video);
};

const connectToNewUser = () => {
  const call = myPeer.call(userId, stream); // making a call
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peeers[userId] = call;
};
