import fs from 'fs';
import { Blob } from 'buffer';


import core from '@actions/core';
import github from '@actions/github';

import { GiteaApi } from 'gitea-api';

async function run() {
  try {
    const serverUrl = core.getInput('serverUrl')
      || (github.context.runId && github.context.serverUrl)
    
    const client = new GiteaApi({
      BASE: `${serverUrl}/api/v1`,
      WITH_CREDENTIALS: true,
      TOKEN: core.getInput('token'),
  });
  const [owner, repo] = (
    core.getInput('repository')
      || github.context.payload.repository.full_name
      || 'actions/batch-example'
  ).split("/");
  
  // const content = '<q id="a"><span id="b">hey!</span></q>'; // the body of the new file…
  const content = fs.readFileSync(core.getInput('asset'))
  const blob = new Blob([content]);
  console.log(
    await client.repository.repoCreateReleaseAttachment({
      owner,
      repo,
      id: core.getInput('id') || github.context.payload.release.id,
      attachment: blob,
      name: core.getInput('asset-name'),
    }),
  );
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
