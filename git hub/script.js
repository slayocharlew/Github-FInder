async function fetchProfile() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const loadingSpinner = document.getElementById('loading');

    if (username) {
      profileDiv.style.display = "none";
      loadingSpinner.style.display = "block";

      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        loadingSpinner.style.display = "none";

        if (data.message === 'Not Found') {
          profileDiv.innerHTML = "<p class='error'>User not found. Please try again.</p>";
          profileDiv.style.display = "block";
        } else {
          profileDiv.innerHTML = `
            <img src="${data.avatar_url}" alt="${data.login}">
            <h2>${data.name || data.login}</h2>
            <p>${data.bio || 'No bio available'}</p>
            <span><strong>Location:</strong> ${data.location || 'Not specified'}</span>
            <span><strong>Company:</strong> ${data.company || 'Not specified'}</span>
            <span><strong>Twitter:</strong> ${data.twitter_username ? '@' + data.twitter_username : 'Not available'}</span>
            <span><strong>Member since:</strong> ${new Date(data.created_at).toLocaleDateString()}</span>
            <div class="profile-stats">
              <div class="stat">
                <p>${data.public_repos}</p>
                <span>Repos</span>
              </div>
              <div class="stat">
                <p>${data.followers}</p>
                <span>Followers</span>
              </div>
              <div class="stat">
                <p>${data.following}</p>
                <span>Following</span>
              </div>
            </div>
            <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
          `;
          profileDiv.style.display = "block";
        }
      } catch (error) {
        loadingSpinner.style.display = "none";
        profileDiv.innerHTML = "<p class='error'>An error occurred. Please try again later.</p>";
        profileDiv.style.display = "block";
      }
    }
  }