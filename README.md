# YSDN 2016

The website for the [2016 YSDN gradshow](http://ysdn2016.com).

## Getting Started

#### Development Environment

If you haven't already, [set up your dev environment](https://github.com/ysdn-2016/wiki/blob/master/development-guide.md#setup)

#### Repository

Next, you'll need to get the code for the site on your computer. Clone the repo by running:

```bash
cd /path/to/folder/where/you/keep/code
git clone git@github.com:ysdn-2016/ysdn-2016.github.io.git
```

#### Local Development

To start the local server, navigate to the project directory and run `make watch`, like so:

```bash
cd /path/to/ysdn-2016.github.io
make watch
```

This will start a server on `http://localhost:8080`, and will automatically watch for changes in the CSS, HTML, or JS.

## Contributing

#### Git

Here's a guide to the different branches:

* `master` is the rendered html output (ie. the live site). Never commit directly to `master`
* `production` is the source files for the live site. Only merge into this branch from `develop`
* `develop` is the workspace branch for upcoming changes (eg. soft-launch). Make/merge changes here.

#### Templates

The site uses the [Swig](http://paularmstrong.github.io/swig/docs/) templating language. You can find documentation here: http://paularmstrong.github.io/swig/docs/

* [Tags](http://paularmstrong.github.io/swig/docs/tags/)
* [Filters](http://paularmstrong.github.io/swig/docs/filters/)
