#!/usr/bin/env node

import fetch from 'node-fetch';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('github-activity')
  .description('Fetch recent GitHub user activity')
  .argument('<username>', 'GitHub username')
  .option('--json', 'Output raw JSON')
  .option('--filter <type>', 'Filter by event type (e.g. PushEvent, IssuesEvent)')
  .parse();

const username = program.args[0];
const { json, filter } = program.opts();

const url = `https://api.github.com/users/${username}/events`;

async function fetchActivity() {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'github-user-activity-cli' }
    });

    if (response.status === 404) {
      console.log(chalk.red(`❌ User '${username}' not found.`));
      return;
    }

    if (response.status === 403) {
      console.log(chalk.red(`⛔ Rate limit exceeded. Try again later.`));
      return;
    }

    const data = await response.json();

    if (json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.log(chalk.gray("ℹ️ No recent public activity."));
      return;
    }

    console.log(chalk.green(`✅ Recent activity for @${username}:\n`));

    const filtered = filter ? data.filter(event => event.type === filter) : data;

    if (filtered.length === 0) {
      console.log(chalk.yellow(`⚠️ No events matched filter: ${filter}`));
      return;
    }

    filtered.forEach(event => {
      const { type, repo } = event;
      const repoName = repo?.name ?? 'unknown';

      switch (type) {
        case "PushEvent":
          const commits = event.payload.commits.length;
          console.log(chalk.green(`🟢 Pushed ${commits} commit(s) to ${repoName}`));
          break;

        case "IssuesEvent":
          console.log(chalk.blue(`🔵 Issue ${event.payload.action} in ${repoName}`));
          break;

        case "PullRequestEvent":
          console.log(chalk.magenta(`🟣 Pull request ${event.payload.action} in ${repoName}`));
          break;

        case "WatchEvent":
          console.log(chalk.yellow(`⭐ Starred ${repoName}`));
          break;

        default:
          console.log(chalk.gray(`📌 ${type} in ${repoName}`));
      }
    });

  } catch (err) {
    console.error(chalk.red("❌ Error fetching data:"), err.message);
  }
}

fetchActivity();
