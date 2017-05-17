# [qbrt.io](https://qbrt.io/)

Package your HTML5/JavaScript Web App as a self-contained Firefox executable (using [qbrt](https://github.com/mozilla/qbrt)).

**[Try it out!](https://qbrt.io/)**


## Usage

1. [Load **https://qbrt.io/**](https://qbrt.io/), and _dive_ right in!
2. Submit your Web App.
3. Wait for the server to generate the package.
4. Download the binary executable!


## Installation

First, ensure [Node](https://nodejs.org/en/download/) is installed. From the command line, install the dependencies:

```sh
npm install
```


## Contributing

Feel free to open a [pull request](https://github.com/cvan/qbrt.io/pulls) to fix any bugs or add a new feature. Please notice that all content submitted, including code and art assets (if any), must be and will be licensed under a [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

1. [Fork](https://help.github.com/articles/fork-a-repo/) [this repository](https://github.com/cvan/qbrt.io/fork) to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local computer.
2. Install the [Node](https://nodejs.org/en/download/) dependencies: `npm install`
3. Link `npm link` to link the local repository to [npm](https://www.npmjs.com/).
4. Run `npm run build` to build and watch for code changes.
5. Run `npm link next` from within your project's directory.
6. Now you can run your app with the local version of `qbrt.io`.


## Development

From the command line, run this command to start the local Node development server:

```sh
npm start
```

### Live-reloading in the browser (with cross-device synchronization)

```sh
npm run serve
```

### Build and optimize

```sh
npm run build
```

### Optimize images

```sh
npm run build-img
```

### Performance insights

```sh
npm run pagespeed
```

### Accessibility

```sh
npm run a11y
```


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/cvan/qbrt.io)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
