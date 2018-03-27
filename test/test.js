/*
 © Copyright IBM Corp. 2018
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

"use strict";

let helpers = require('yeoman-test');
let assert = require('yeoman-assert');
let path = require('path');
let fs = require('fs-extra');

let bluemixSettings = {
	name: "MyTest",
	backendPlatform: "SWIFT",
	"cloudant": [
		{
			"password": "pass",
			"url": "https://account.cloudant.com",
			"username": "user"
		}
	],
	"objectStorage": [
		{
			"password": "Gl.=W23@",
			"projectId": "12345",
			"region": "dallas",
			"userId": "abc1234"
		}
	]
};

let requiredFilesForBasic = [
	'public/index.html',
	'public/js/bundle.js',
	'public/css/default.css'
];

let requiredFilesForAngular = [
	'client/app.js',
	'client/component.html',
	'client/index.html',
	'test/test-server.js',
	'webpack.common.js',
	'webpack.dev-proxy.js',
	'webpack.dev-standalone.js',
	'webpack.prod.js',
];

let requiredFilesForWebpack = [
	'public/index.html',
	'src/client/app/index.jsx',
	'src/client/sass/default.scss',
	'webpack.config.js'
];

let requiredFilesForReact = [
	'client/index.html',
	'client/app/App.jsx',
	'client/default.scss',
	'test/test-server.js',
	'webpack.common.js',
	'webpack.dev-proxy.js',
	'webpack.dev-standalone.js',
	'webpack.prod.js',
];

describe('Web project generator', function () {

	// NodeJS tests

	describe('Basic app with NodeJS', function () {

		beforeEach(function () {

			bluemixSettings.backendPlatform = "NODE";

			return helpers.run(path.join(__dirname, '../generators/app'))
				.inTmpDir()
				.withOptions({
					bluemix: JSON.stringify(bluemixSettings),
					framework: "None"
				});
		});

		it('does not contain web pages', function () {

			assert.noFile(requiredFilesForBasic);

		});

		it('does not contains web sources', function () {
			assert.noFile(['src/client/index.html',
				'src/client/sass/default.scss'
			]);
		});

		// it('starter text appears', function () {
		// 	assert.fileContent('public/index.html', 'You are currently running a NodeJS server.')
		// });


	});

	describe('Webpack app with NodeJS', function () {

		beforeEach(function () {

			bluemixSettings.backendPlatform = "NODE";

			return helpers.run(path.join(__dirname, '../generators/app'))
				.inTmpDir(function (dir) {
					fs.copySync(path.join(__dirname, 'resources/package.json'), path.join(dir, 'package.json'));
					fs.copySync(path.join(__dirname, 'resources/Dockerfile'), path.join(dir, 'Dockerfile'));
					fs.copySync(path.join(__dirname, 'resources/manifest.yml'), path.join(dir, 'manifest.yml'));
				})
				.withOptions({
					bluemix: JSON.stringify(bluemixSettings),
					framework: "Webpack"
				});
		});

		it('required files created', function () {

			assert.file(requiredFilesForWebpack);

		});

		it('contains original dependencies', function () {

			assert.fileContent('package.json', 'appmetrics-dash');
			assert.fileContent('package.json', 'express');

		});

		it('contains new dependencies', function () {

			assert.fileContent('package.json', 'webpack');
			assert.fileContent('package.json', 'babel');

		});

		it('does not have React', function () {
			assert.noFileContent('package.json', 'react');
			assert.noFileContent('package.json', 'react-dom');
		});

		it('starter writes NodeJS', function () {
			assert.fileContent('src/client/app/index.jsx', 'You are currently running a NodeJS server.');
		});

		it('should modify Dockerfile', function () {
			assert.fileContent('Dockerfile', 'npm run build;');
		});

		it('should modify manifest.yml', function () {
			assert.fileContent('manifest.yml', 'npm prune --production');
			assert.fileContent('manifest.yml', 'NPM_CONFIG_PRODUCTION');
		})
	});

	describe('React app with NodeJS', function () {

		beforeEach(function () {

			bluemixSettings.backendPlatform = "NODE";

			return helpers.run(path.join(__dirname, '../generators/app'))
				.inTmpDir(function (dir) {
					fs.copySync(path.join(__dirname, 'resources/package.json'), path.join(dir, 'package.json'));
					fs.copySync(path.join(__dirname, 'resources/Dockerfile'), path.join(dir, 'Dockerfile'));
					fs.copySync(path.join(__dirname, 'resources/manifest.yml'), path.join(dir, 'manifest.yml'));
				})
				.withOptions({
					bluemix: JSON.stringify(bluemixSettings),
					framework: "React"
				});
		});

		it('required files created', function () {

			assert.file(requiredFilesForReact);

		});

		it('contains original dependencies', function () {

			assert.fileContent('package.json', 'appmetrics-dash');
			assert.fileContent('package.json', 'express');

		});

		it('contains Webpack', function () {

			assert.fileContent('package.json', 'webpack');
			assert.fileContent('package.json', 'babel');

			// assert.fileContent('package.json', 'webpack-dev-server');

		});

		it('contains React', function () {
			assert.fileContent('package.json', 'react');
			assert.fileContent('package.json', 'react-dom');
			assert.fileContent('package.json', 'babel-preset-react');
		});

		it('should modify Dockerfile', function () {
			assert.fileContent('Dockerfile', 'npm run build;');
		});

		it('should modify manifest.yml', function () {
			assert.fileContent('manifest.yml', 'npm prune --production');
			assert.fileContent('manifest.yml', 'NPM_CONFIG_PRODUCTION');
		})
	});

	describe('AngularJS app with NodeJS and present existing files', function () {
		beforeEach(function () {

			bluemixSettings.backendPlatform = "NODE";

			return helpers.run(path.join(__dirname, '../generators/app'))
				.inTmpDir(function (dir) {
					fs.copySync(path.join(__dirname, 'resources/package.json'), path.join(dir, 'package.json'));
					fs.copySync(path.join(__dirname, 'resources/Dockerfile'), path.join(dir, 'Dockerfile'));
					fs.copySync(path.join(__dirname, 'resources/manifest.yml'), path.join(dir, 'manifest.yml'));
				})
				.withOptions({
					bluemix: JSON.stringify(bluemixSettings),
					framework: "AngularJS"
				});
		});

		it('required files created', function () {
			assert.file(requiredFilesForAngular);
		});

		it('contains original dependencies', function () {

			assert.fileContent('package.json', 'appmetrics-dash');
			assert.fileContent('package.json', 'express');

		});


		it('should modify Dockerfile', function () {
			assert.fileContent('Dockerfile', 'npm run build;');
		});

		it('should modify manifest.yml', function () {
			assert.fileContent('manifest.yml', 'npm prune --production');
			assert.fileContent('manifest.yml', 'NPM_CONFIG_PRODUCTION');
		})

		it('should have react specific build script', function() {
			assert.fileContent('package.json', 'webpack --progress --config webpack.prod.js');
		})

		it('should have original scripts and dependencies', function() {
			assert.fileContent('package.json', 'mocha');
			assert.fileContent('package.json', 'node --debug server/server.js');
		})
	});

	describe('AngularJS app with NodeJS with empty user directory', function () {
		beforeEach(function () {

			bluemixSettings.backendPlatform = "NODE";

			return helpers.run(path.join(__dirname, '../generators/app'))
				.withOptions({
					bluemix: JSON.stringify(bluemixSettings),
					framework: "AngularJS"
				});
		});

		it('required files created', function () {
			assert.file(requiredFilesForAngular);
		});

		it('contains original dependencies', function () {

			assert.fileContent('package.json', 'appmetrics-dash');
			assert.fileContent('package.json', 'express');

		});


		it('should not have Dockerfile', function () {
			assert.noFile('Dockerfile')
		});

		it('should not have manifest.yml', function () {
			assert.noFile('manifest.yml');
		});

		it('should have react specific build script', function() {
			assert.fileContent('package.json', 'webpack --progress --config webpack.prod.js');
		});

		it('should have original scripts and dependencies', function() {
			assert.fileContent('package.json', 'mocha');
			assert.fileContent('package.json', 'node --debug server/server.js');
		})
	});
});
