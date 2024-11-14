const token = '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'; // Replace with your actual token

async function fetchProfile() {
  const username = document.getElementById('username').value;
  const profileDiv = document.getElementById('profile');
  const loadingSpinner = document.getElementById('loading');

  if (username) {
    profileDiv.style.display = "none";
    loadingSpinner.style.display = "flex";

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query($login: String!) {
              user(login: $login) {
                name
                login
                avatarUrl
                bio
                location
                company
                twitterUsername
                createdAt
                followers { totalCount }
                following { totalCount }
                repositories(first: 3, orderBy: {field: UPDATED_AT, direction: DESC}) {
                  nodes {
                    name
                    description
                    primaryLanguage {
                      name
                      color
                    }
                    url
                  }
                }
                pinnedItems(first: 3) {
                  nodes {
                    ... on Repository {
                      name
                      description
                      url
                    }
                  }
                }
              }
            }
          `,
          variables: { login: username }
        })
      });
      
      const { data } = await response.json();
      loadingSpinner.style.display = "none";

      if (!data.user) {
        profileDiv.innerHTML = "<p class='error'>User not found. Please try again.</p>";
      } else {
        const user = data.user;
        const languages = user.repositories.nodes.map(repo => repo.primaryLanguage).filter(lang => lang);
        const recentActivity = user.repositories.nodes;
        const pinnedRepos = user.pinnedItems.nodes;

        profileDiv.innerHTML = `
          <img src="${user.avatarUrl}" alt="${user.login}">
          <h2>${user.name || user.login}</h2>
          <p>${user.bio || 'No bio available'}</p>
          <span><strong>Location:</strong> ${user.location || 'Not specified'}</span>
          <span><strong>Company:</strong> ${user.company || 'Not specified'}</span>
          <span><strong>Twitter:</strong> ${user.twitterUsername ? '@' + user.twitterUsername : 'Not available'}</span>
          <span><strong>Member since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</span>
          <div class="profile-stats">
            <div class="stat">
              <p>${user.followers.totalCount}</p>
              <span>Followers</span>
            </div>
            <div class="stat">
              <p>${user.following.totalCount}</p>
              <span>Following</span>
            </div>
          </div>
          <h3>Pinned Repositories</h3>
          <ul class="repo-list">
            ${pinnedRepos.map(repo => `
              <li>
                <a href="${repo.url}" target="_blank"><strong>${repo.name}</strong></a>: ${repo.description || 'No description'}
              </li>
            `).join('')}
          </ul>
          <h3>Recent Activity</h3>
          <ul class="repo-list">
            ${recentActivity.map(repo => `
              <li>
                <a href="${repo.url}" target="_blank"><strong>${repo.name}</strong></a>: ${repo.description || 'No description'}
              </li>
            `).join('')}
          </ul>
          <h3>Languages</h3>
          <ul class="language-list">
            ${[...new Set(languages.map(lang => lang.name))].map(lang => `
              <li style="color: ${languages.find(l => l.name === lang).color}">${lang}</li>
            `).join('')}
          </ul>
        `;
      }
      profileDiv.style.display = "block";
    } catch (error) {
      loadingSpinner.style.display = "none";
      profileDiv.innerHTML = "<p class='error'>An error occurred. Please try again later.</p>";
      profileDiv.style.display = "block";
    }
  }
}
