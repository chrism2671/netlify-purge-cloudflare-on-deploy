# netlify-purge-cloudflare-on-deploy
Automatically purge Cloudflare cache on Netlify deploy.

From Cloudflare, you'll need:
* Your Cloudflare email address.
* Your Zone ID. Go to your Cloudflare dashboard, enter your website, and look in the bottom right hand corner under 'API'.
* Your Cloudflare API key.

Strictly this plugin triggers the cache purge before deploy (but after build), as this is the only functionality Netlify provides.

In Netlify, go to Settings -> Build & Deploy -> Environment -> Environment variables and set up:
* CLOUDFLARE_EMAIL
* CLOUDFLARE_ZONE_ID
* CLOUDFLARE_API_KEY

## Build failure with 'Bad request'

Check you set up your environment variables properly.

## netlify.toml template

    [[plugins]]
    package = "./plugins/netlify-purge-cloudflare-on-deploy"
