const fetch = require('node-fetch');

const {
  env: { CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_KEY, CLOUDFLARE_ZONE_ID, CLOUDFLARE_EMAIL },
} = require('process');

let authMethod = 'na';
switch( true ) {
  case typeof CLOUDFLARE_API_TOKEN !== 'undefined' && typeof CLOUDFLARE_ZONE_ID !== 'undefined':
    authMethod = 'TOKEN';
    break;

  case typeof CLOUDFLARE_API_KEY !== 'undefined' && typeof CLOUDFLARE_ZONE_ID !== 'undefined' && typeof CLOUDFLARE_EMAIL !== 'undefined':
    authMethod = 'KEY';
    break;
}

module.exports = {
  async onEnd({
                utils: {
                  build: { failPlugin, failBuild },
                },
              }) {

    // Since calling utils.build.failBuild will not actually fail the build in onPreBuild, moved the conditions in onPreBuild.
    if( authMethod === 'na' ) {
      return failBuild(
          'Could not determine auth method.  Please review the plugin README file and verify your environment variables'
      );
    }
    else if( authMethod !== 'TOKEN' && authMethod !== 'KEY' ) {
      return failBuild(
          "'" + authMethod + "' is not a valid Authentication Method.  Please report this issue to the developer."
      );
    }
    else {
      console.log('Cloudflare ' + authMethod + ' Authentication method detected.');
    }

    console.log('Preparing to trigger Cloudflare cache purge');
    let baseUrl = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`;
    let headers;
    switch( authMethod ) {
      case 'TOKEN':
        headers = {
          'Authorization': 'Bearer ' + CLOUDFLARE_API_TOKEN,
          'Content-Type': 'application/json'
        };
        break;

      case 'KEY':
        headers = {
          'X-Auth-Email': CLOUDFLARE_EMAIL,
          'X-Auth-Key': CLOUDFLARE_API_KEY,
          'Content-Type': 'application/json'
        };
        break;
    }
    let body = { purge_everything: true };

    try {
      const { status, statusText } = await fetch(baseUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (status != 200) {
        return failPlugin(
            "Cloudflare cache couldn't be purged. Status: " + status + " " + statusText
        );
      }
      console.log('Cloudflare cache purged successfully!');
    } catch (error) {
      return failBuild('Cloudflare cache purge failed', { error });
    }
  },
};
