// Get the section where the video cards will be displayed
const videoSection = document.getElementById('section');

// Select the loader element which will be shown during data fetching
const loader = document.querySelector('.loader');

// Get the search input element where users will type their queries
const searchInput = document.querySelector(".search-bar");

// The URL to fetch the video data from the API
const url = 'https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=157&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest';

// Initialize an empty array to store fetched video data (for filtering later)
let fetched_videos = [];

// Async function to get videos from the API
async function getVideos() {
    // Fetch the video data from the API
    await fetch(url)
    .then(res => res.json())  // Parse the response as JSON
    .then(data => {
        // Once data is fetched, hide the loader
        loader.style.display = 'none';

        // Extract the actual video data from the response object
        const actualData = data.data.data;

        // Loop through each video in the response data
        actualData.forEach(element => {
            // Extract video details: title, thumbnail URL, channel ID, and channel name
            const title = element.items.snippet.title;
            const thumnails = element.items.snippet.thumbnails.maxres.url;
            const channelId = element.items.snippet.channelId;
            const channelLink = element.items.snippet.channelTitle;

            // Create a div element for each video card
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video'); // Add a class to style the video card

            // Set the HTML structure inside the video div
            videoDiv.innerHTML = `
                <!-- The video thumbnail with a link to YouTube -->
                <a class="video-thumbnail" target="_blank" href="https://www.youtube.com/watch?v=${element.items.id}">
                    <img src="${thumnails}" />
                </a>
                <div class="video-info">
                    <div class="video-title">${title}</div>
                    <!-- Link to the channel -->
                    <a target="_blank" href="https://www.youtube.com/channel/${channelId}">
                        <div class="video-channel">${channelLink}</div>
                    </a>
                </div>
            `;

            // Append the videoDiv (the video card) to the main video section
            videoSection.appendChild(videoDiv);

            // Store the video title and its corresponding div element in the fetched_videos array
            fetched_videos.push({ title, div: videoDiv });
        });
    })
    .catch(err => {
        // If there's an error in fetching the data show a message to the user
        loader.style.display = 'inline-block'; // Show the loader again
        videoSection.innerHTML = `<div class="error">Something went wrong, try again later</div>`; // Display error message
    });
}

// Call the function to fetch the videos as soon as the script runs
getVideos();

// Add an event listener to the search input to filter videos as the user types
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase(); // Convert the search input to lowercase to make the search case-insensitive

    // Loop through the fetched videos and check if the video title matches the search input
    fetched_videos.forEach(video => {
        // If the video title includes the search value, we keep it visible, otherwise, hide it
        const isVisible = video.title.toLowerCase().includes(value);

        // Toggle the 'hide' class based on whether the video matches the search term
        video.div.classList.toggle("hide", !isVisible); // Show or hide the video element
        // Alternatively, you could use 'style.display' to show or hide the video
        // video.div.style.display = isVisible ? 'block' : 'none'; 
    });
});
