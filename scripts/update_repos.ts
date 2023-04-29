// Updates _data/repos.json with the latest repos from the NSA GitHub organization.

interface Repo {
  name: string;
  description: string;
  html_url: string;
  forks_count: string;
  stargazers_count: number;
  homepage: string;
}

async function getRepos(): Promise<Repo[]> {
  console.log('Fetching repos...');
  let page = 1;
  let repos: Repo[] = [];

  do {
    const response = await fetch(`https://api.github.com/users/NationalSecurityAgency/repos?page=${page}&per_page=100`);
    const newRepos = await response.json();

    if (newRepos.length === 0) {
      break;
    }

    repos = [...repos, ...newRepos];
    page++;
  } while (true);

  return repos;
}


function processRepos(repos: Repo[]): Repo[] {
  console.log(`Processing ${repos.length} repos...`);
  const sorted = repos.sort((a, b) => a.name.localeCompare(b.name));
  const processedRepos = [];
  for (const repo of sorted) {
    const { name, description, html_url, forks_count, stargazers_count, homepage } = repo;
    processedRepos.push({
      name, description: description || "", html_url, forks_count, stargazers_count, homepage: homepage || ""
    })
  }

  return processedRepos;
}

(async () => {
  const repos = await getRepos();
  const reposSorted = {list: processRepos(repos)};

  Deno.writeTextFileSync('_data/repos.json', JSON.stringify(reposSorted, null, 2));

  console.log('Successfully updated _data/repos.json!');
})();