/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const API_KEY = 'AIzaSyDBIXTJ2aHGw1ijCQutEIsJs5PGk4jECeY'; // Replace with your YouTube Data API key
            const PLAYLIST_ID = 'PL56zy-6e7Tc-dg7unRNUFtEzYTgofFss9'; // Replace with your playlist ID
            const PLAYLIST_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

            async function fetchAndEmbedRandomVideos() {
                try {
                    const response = await fetch(PLAYLIST_API_URL);
                    const data = await response.json();
                    const videos = data.items;

                    // Select two random videos
                    const randomVideoIndices = Array.from({ length: 2 }, () => Math.floor(Math.random() * videos.length));
                    const randomVideos = randomVideoIndices.map(index => videos[index]);

                    // Fetch video details to get duration
                    const videoIds = randomVideos.map(video => video.snippet.resourceId.videoId);
                    const VIDEO_API_URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`;
                    const videoResponse = await fetch(VIDEO_API_URL);
                    const videoData = await videoResponse.json();
                    const videoDetails = videoData.items;

                    // Map video IDs to their durations
                    const videoDurations = {};
                    videoDetails.forEach(video => {
                        videoDurations[video.id] = formatDuration(video.contentDetails.duration);
                    });

                    const videoList = document.getElementById('videoList');
                    videoList.innerHTML = ''; // Clear the list before adding new videos

                    randomVideos.forEach(video => {
                        const videoId = video.snippet.resourceId.videoId;
                        const title = video.snippet.title;
                        const thumbnailUrl = video.snippet.thumbnails.medium.url; // Thumbnail URL
                        const duration = videoDurations[videoId]; // Get duration from the video details

                        // Create a card for each video
                        const cardHtml = `
                            <div class="col-12 mb-3">
                                <div class="card border-0 bg-gunmetal text-white rounded">
                                    <div class="row g-0">
                                        <div class="col-md-2 col-3">
                                            <div class="thumbnail-container">
                                                <img src="${thumbnailUrl}" class="thumbnail rounded-start" alt="${title} Artwork">
                                            </div>
                                        </div>
                                        <div class="col-md-8 col-6">
                                            <div class="card-body">
                                                <h5 class="card-title text-truncate">${title}</h5>
                                                <p class="card-text text-truncate">${duration}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-2 col-3">
                                            <div class="card-body position-relative h-100">
                                                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn btn-moonstone rounded-circle text-white position-absolute top-50 start-50 translate-middle"><i class="fa-solid fa-play"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        // Append the card to the video list
                        videoList.innerHTML += cardHtml;
                    });
                } catch (error) {
                    console.error('Error fetching playlist:', error);
                }
            }

            // Function to format duration from ISO 8601 format
            function formatDuration(duration) {
                const parts = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                let hours = parts[1] ? parseInt(parts[1].replace('H', '')) : 0;
                let minutes = parts[2] ? parseInt(parts[2].replace('M', '')) : 0;
                let seconds = parts[3] ? parseInt(parts[3].replace('S', '')) : 0;

                if (hours > 0) {
                    return `${hours} hours ${minutes} minutes`;
                } else if (minutes > 0) {
                    return `${minutes} minutes ${seconds} seconds`;
                } else {
                    return `${seconds} seconds`;
                }
            }

            fetchAndEmbedRandomVideos();
