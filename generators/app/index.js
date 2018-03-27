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

 'use strict';
const Generator = require('yeoman-generator');
const yamlParser = require('yaml-parser');
const dep = require('./templates/dependencies.json');
const reactDep = require('./templates/react/dependencies.json');
const angularJsDep = require('./templates/angularjs/dependencies.json');

const scripts = dep.scripts;
const angularJsScripts = angularJsDep.scripts;

const devDependencies = dep.devDependencies;
const angularJsDevDependencies = angularJsDep.devDependencies;

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.framework = opts.framework;

		if (typeof (opts.bluemix) === 'string') {
			this.bluemix = JSON.parse(opts.bluemix || "{}");
		} else {
			this.bluemix = opts.bluemix;
		}

		this.humanNameLanguage = {
			"NODE": "NodeJS",
			"SWIFT": "Swift",
			"JAVA": "Java",
			"PYTHON": "Python",
			"DJANGO": "Django"
		};
	}

	paths() {
		this.sourceRoot();
		this.templatePath('index.js');
	}

	prompting() {
		let prompts = [];
		if (this.bluemix === undefined) {
			this.bluemix = {};
			prompts.push({
				type: 'input',
				name: 'name',
				message: 'Your project name'
			});
			prompts.push({
				type: 'list',
				name: 'framework',
				message: 'What framework are you using',
				choices: [
					"None",
					"React",
					"AngularJS"
				]
			});
			prompts.push({
				type: 'list',
				name: 'language',
				message: 'What language are you using',
				choices: [
					"SWIFT",
					"NODE",
					"JAVA",
					"PYTHON",
					"DJANGO"
				]
			});
		}

		return this.prompt(prompts).then(this._processAnswers.bind(this));
	}

	_processAnswers(answers) {

		this.bluemix.backendPlatform = answers.language || this.bluemix.backendPlatform;
		this.framework = answers.framework || this.framework;
		this.bluemix.name = answers.name || this.bluemix.name;
	}

	write() {
		switch (this.framework) {
			case "None":
				this._generateBasic();
				break;
			case "React":
				this._generateReact();
				break;
			case "AngularJS":
				this._generateAngularJS();
				break;
			default:
				throw 'Unknown generator type';
		}
	}

	_generateBasic() {

		// Replace server test with Web specific test.
		if (this.bluemix.backendPlatform === 'NODE') {
			this.fs.copyTpl(
				this.templatePath('basic/test-server.js'),
				this.destinationPath('test/test-server.js'), {}
			);

			this.fs.copyTpl(
				this.templatePath('basic/node'),
				this.destinationPath('public'), {}
			);

		}

		else {
			this.fs.copyTpl(
				this.templatePath('basic/python/index.html'),
				this.destinationPath('public/index.html'), {
					applicationName: this.bluemix.name,
					language: this.humanNameLanguage[this.bluemix.backendPlatform]
				}
			);
			this.fs.copyTpl(
				this.templatePath('basic/python/404.html'),
				this.destinationPath('public/404.html'), {}
			);
			this.fs.copyTpl(
				this.templatePath('basic/python/500.html'),
				this.destinationPath('public/500.html'), {}
			);
		}

	}

	_generateReact() {

		// Replace server test with Web specific test.
		this.fs.copyTpl(
			this.templatePath('react/test-server.js'),
			this.destinationPath('test/test-server.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/Procfile-dev'),
			this.destinationPath('Procfile-dev'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/babelrc'),
			this.destinationPath('.babelrc'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.common.js'),
			this.destinationPath('webpack.common.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.dev-proxy.js'),
			this.destinationPath('webpack.dev-proxy.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.dev-standalone.js'),
			this.destinationPath('webpack.dev-standalone.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.prod.js'),
			this.destinationPath('webpack.prod.js'), {}
		);

		if (!this.fs.exists(this.destinationPath('package.json'))) {
			this.fs.copyTpl(
				this.templatePath('package.json'),
				this.destinationPath('package.json'), {
					applicationName: this.bluemix.name,
					language: this.bluemix.backendPlatform
				}
			);
		}

		this._augmentPackageJSON({ react: true });

		this.fs.copyTpl(
			this.templatePath('react/client'),
			this.destinationPath('client'), {}
		);

		this._rewriteBuild();
	}

	_generateAngularJS() {

		// Replace server test with Web specific test.
		this.fs.copyTpl(
			this.templatePath('angularjs/test-server.js'),
			this.destinationPath('test/test-server.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.common.js'),
			this.destinationPath('webpack.common.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.dev-proxy.js'),
			this.destinationPath('webpack.dev-proxy.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.dev-standalone.js'),
			this.destinationPath('webpack.dev-standalone.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.prod.js'),
			this.destinationPath('webpack.prod.js'), {}
		);

		if (!this.fs.exists(this.destinationPath('package.json'))) {
			this.fs.copyTpl(
				this.templatePath('package.json'),
				this.destinationPath('package.json'), {
					applicationName: this.bluemix.name,
					language: this.bluemix.backendPlatform
				}
			);
		}

		this._augmentPackageJSON({ angularjs: true });

		this.fs.copyTpl(
			this.templatePath('angularjs/client'),
			this.destinationPath('client'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/client/404.html'),
			this.destinationPath('public/404.html'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/client/500.html'),
			this.destinationPath('public/500.html'), {}
		);

		this._rewriteBuild();
	}

	_augmentPackageJSON(options) {
		let packageFile = this.fs.read(this.destinationPath('package.json'), { defaults: "{}" });
		let packageFileJSON;

		try {
			packageFileJSON = JSON.parse(packageFile);
		} catch (err) {
			packageFileJSON = {};
		}

		if (packageFileJSON.devDependencies === undefined) {
			packageFileJSON.devDependencies = {};
		}

		packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, scripts);
		packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, devDependencies);

		if (options !== undefined && options.react) {
			packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, reactDep.scripts);
			packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, reactDep.devDependencies);
		}

		if (options !== undefined && options.angularjs) {
			packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, angularJsDevDependencies);
			packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, angularJsScripts);
		}

		this.fs.writeJSON(this.destinationPath('package.json'), packageFileJSON, null, 4);
	}

	_rewriteBuild() {

		if (this.fs.exists(this.destinationPath('Dockerfile'))) {
			let Dockerfile = this.fs.read(this.destinationPath('Dockerfile'));
			if (Dockerfile.indexOf('webpack.config.js') < 0) {
				Dockerfile = Dockerfile.replace('COPY package.json /app/\nRUN cd /app; npm install --production', 'COPY package.json webpack.config.js /app/\nRUN cd /app; npm install --production\nCOPY /client /app/client/\nRUN npm install --only=dev; npm run build; npm prune --production');
			}

			this.fs.write(this.destinationPath('Dockerfile'), Dockerfile);
		}

		if (this.fs.exists(this.destinationPath('manifest.yml'))) {
			let manifest = this.fs.read(this.destinationPath('manifest.yml'));
			if (manifest.indexOf('npm prune') < 0) {
				manifest = manifest.replace('npm start', 'npm prune --production && NODE_ENV=production npm start');
			}

			if (manifest.indexOf('NPM_CONFIG_PRODUCTION' < 0)) {
				let manifest_parsed = yamlParser.safeLoad(manifest);

				if (manifest_parsed.applications && manifest_parsed.applications[0]) {
					let env = manifest_parsed.applications[0].env || {};
					env.NPM_CONFIG_PRODUCTION = false;
					manifest_parsed.applications[0].env = env;
					manifest = yamlParser.safeDump(manifest_parsed);
				}
			}

			this.fs.write(this.destinationPath('manifest.yml'), manifest);
		}
	}

};