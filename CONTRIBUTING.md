# Contributing

Use Node.js 24 and install dependencies with `nvm use` and `npm ci`.
Set `APIKEY` and its allowed `REFERRER` in a local `.env` for the Maps JS API
integration tests. The shared webpack config in CLI 0.0.25 also requires
`APIKEY` when building. Start the example with `npm start`.

```sh
npm run lint
npm run build
npm test
npm pack --dry-run
```

## Development loader

For development, load from `dist`:

```js
ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('ymaps3-context-menu')) return;

    // Load script from dev server
    await ymaps3.import.script(`./dist/index.js`);

    return window['ymaps3-context-menu'];
});
```

## Continuous integration

The `build` job runs the commands above after `npm ci` for pull requests to
`main` and pushes to `main`. Configure the Actions secrets `APIKEY` and
`REFERRER` for the live tests. Keep repository secrets disabled for fork pull
requests.

## Publishing

Configure GitHub Actions as the npm trusted publisher of
`@yandex/ymaps3-context-menu`, using repository `yandex/ymaps3-context-menu`,
workflow `release.yml`, and an empty environment. Allow direct npm publishing.

To release a patch, run `npm run bump` on a clean, up-to-date `main`. It
increments the version and pushes the release commit and its tag atomically.
A tag push starts the release workflow. For a manual run select the matching
version tag. The tag must match `package.json` exactly and its commit must be
in the history of `main`. After all checks pass, stable versions publish to
`latest` and prereleases to `next`.
