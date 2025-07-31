
# GitHub User Activity CLI

Sample solution for the [github-user-activity](https://roadmap.sh/projects/github-user-activity) challenge from [roadmap.sh](https://roadmap.sh).

A simple Node.js CLI tool to fetch and display recent public activity of any GitHub user.

## Features

- Fetches recent events from the GitHub API
- Displays events like Push, Issues, Pull Requests, Stars, and more
- Easy to use via command line

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/karthiknew07/github-user-activity-cli.git
cd github-user-activity-cli
npm install
```
#  usage 
Run the CLI with a GitHub username:

```bash
github-activity torvalds
```
output example 

```bash
✅ Recent activity for @torvalds:

🟢 Pushed 3 commit(s) to torvalds/linux
🔵 Issue opened in torvalds/git
⭐ Starred torvalds/subsurface
```

