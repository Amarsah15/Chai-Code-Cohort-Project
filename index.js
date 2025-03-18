const videoSection = document.getElementById('section');
const loader = document.querySelector('.loader');
const searchInput = document.querySelector(".search-bar");

const url = 'https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest';

let fetched_videos = [];

async function getVideos() {
    await fetch(url)
    .then(res => res.json())
    .then(data => {
        loader.style.display = 'none';
        const actualData = data.data.data;
        actualData.forEach(element => {
            const title = element.items.snippet.title;
            const thumnails = element.items.snippet.thumbnails.maxres.url;
            const channelId = element.items.snippet.channelId;
            const channelLink = element.items.snippet.channelTitle;

            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video');
            videoDiv.innerHTML = `
                <a class="video-thumbnail" target="_blank" href="https://www.youtube.com/watch?v=${element.items.id}">
                    <img src="${thumnails}" />
                </a>
                <div class="video-info">
                    <div class="video-title">${title}</div>
                    <a target="_blank" href="https://www.youtube.com/channel/${channelId}">
                        <div class="video-channel">${channelLink}</div>
                    </a>
                </div>
            `;

            // Add the videoDiv to the section
            videoSection.appendChild(videoDiv);

            // Store the video title and its corresponding div for filtering
            fetched_videos.push({ title, div: videoDiv });
        });
    })
    .catch(err => {
        console.log(err);
        loader.style.display = 'inline-block';
        videoSection.innerHTML = `<div class="error">Something went wrong, try again later</div>`;
    });
}

getVideos();

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase(); // Make the search case-insensitive

    // Loop through the fetched videos and check if the title includes the search value
    fetched_videos.forEach(video => {
        const isVisible = video.title.toLowerCase().includes(value);
        video.div.classList.toggle("hide" ,!isVisible); // Show or hide the video
        // video.div.style.display = isVisible ? 'block' : 'none'; // Show or hide the div
    });
});
