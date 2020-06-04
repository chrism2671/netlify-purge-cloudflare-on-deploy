const fetch = require('node-fetch');

const {
  env: { CLOUDFLARE_API_KEY, CLOUDFLARE_ZONE_ID, CLOUDFLARE_EMAIL },
} = require('process');

module.exports = {
  async onEnd({
    inputs,
    utils: {
      build: { failPlugin, failBuild },
    },
  }) {
    console.log('Preparing to trigger Cloudflare cache purge');
    let baseUrl = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`;
    let headers = {
      'X-Auth-Email': CLOUDFLARE_EMAIL,
      'X-Auth-Key': CLOUDFLARE_API_KEY,
      'Content-Type': 'application/json',
    };
    let body = { purge_everything: true };

    try {
      const { status, statusText } = await fetch(baseUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (status != 200) {
        return failPlugin(
          "Cloudflare cache couldn't be purged. Status: " + statusText
        );
      }
      console.log('Cloudflare cache purged!');
    } catch (error) {
      return failBuild('Cloudflare cache purge failed', { error });
    }
  },
};
