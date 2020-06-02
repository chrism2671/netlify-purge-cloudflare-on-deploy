const fetch = require('node-fetch');

module.exports = {
  async onEnd({
    inputs,
    utils: {
      build: { failPlugin, failBuild },
    },
  }) {
    console.log('Preparing to trigger Cloudflare cache purge');
    let baseUrl = `https://api.cloudflare.com/client/v4/zones/${inputs.zoneId}/purge_cache`;
    let headers = {
      'X-Auth-Email': inputs.cloudflareEmail,
      'X-Auth-Key': inputs.cloudflareApiKey,
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
