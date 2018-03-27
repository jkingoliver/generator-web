# Web Starter Yeoman Generator [![Build Status](https://travis.ibm.com/arf/generator-web.svg?token=ePBWPJTgR2KYCeTsit1a&branch=master)](https://travis.ibm.com/arf/generator-web) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# 

Creates a web project sources in an existing project directory adding boilerplate code for modern web development.

## Getting Started with a generated project

1. Run the generator and choose the options:
  `yo @arf/web`

2. Install the dependencies: 
  `npm install`

3. Compile the sources:

  `./node_modules/webpack/bin/webpack.js`
  
  or, if you have Webpack installed, simply:
  
  `webpack`
  
3. Open `public/index.html` on your browser

## Frameworks

Frameworks are chosen using the `framework` option at the end of the generator. For example,

```
yo @arf/web --framework {None, Webpack, React}
```

### Basic

In the basic case, the following files are created:

- `public/index.html` - Basic HTML scaffold
- `public/css/default.css` - Empty stylesheet
- `public/js/bundle.js` - Empty JavaScript source

It is therefore important that the web server is registered to serve files in the `public` directory.

### WebPack

Adding the Webpack option creates a web project with an opinionated structure. Webpack allows your sources to be bundled and compressed. In addition, JavaScript extensions such as ES2015+ and stage-2 are supported for transpilation of sources from `jsx` to `js`. 

- [gulp](http://gulpjs.com/) - a task runner to compile your project
- [webpack](https://webpack.github.io/) - bundles your JS modules
  - sass-loader 
  - css-loader
  - style-loader
- [sass](http://sass-lang.com/) - CSS extension language
- [babel](https://babeljs.io/) - support ES2015+

Basic web sources are stored in to `src/client`:

- `src/client/app` - Your application
- `src/client/html` - HTML sources
- `src/client/sass` - SASS stylesheets

After `gulp` is run, the sources in are compiled into the `public` subdirectory.

## React

- [react](https://facebook.github.io/react/) - to build user interfaces

## AngularJS

TODO

# Stylesheet frameworks

 - [Bulma](http://bulma.io/) - a modern CSS framework based on Flexbox


## Publishing Changes

In order to publish changes, you will need to fork the repository or branch off the `master` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) before contributing. To help you with commit a commit template is provide. Run `config.sh` to initialize the commit template to your `.git/config` or use [commitizen](https://www.npmjs.com/package/commitizen)

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `master`, make sure the build passes. A team member will review and merge your pull request.
Once merged to `master` an auto generated pull request will be created against master to update the changelog. Make sure that the CHANGELOG.md and the package.json is correct before merging the pull request. After the auto generated pull request has been merged to `master` the version will be bumped and published to Artifactory.