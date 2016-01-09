
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT      ?= 8080
HOST      ?= localhost
NODE_ENV  ?= development

LAYOUTS    = $(shell find ./layouts -type f -name '*.html')
CONTENT    = $(shell find ./content -type f -name '*.md' -or -type f -name '*.yml')

IMAGES     = $(shell find ./assets -type f -name '*.jpg' -or -type f -name '*.png' -or -type f -name '*.gif' -or -type f -name '*.svg')
STYLES     = $(shell find ./assets -type f -name '*.scss')
SCRIPTS    = $(shell find ./assets -type f -name '*.js')

DOMAIN     = ysdn-2016.github.io
REPO       = ysdn-2016/ysdn-2016.github.io
BRANCH     = $(shell git rev-parse --abbrev-ref HEAD)

API        = http://159.203.25.109:19320

#
# Tasks
#

build: node_modules content assets styles
start: build
	@bin/www

watch: install build
	@$(BIN)/onchange 'content/**/*.{md,yml}' 'layouts/**/*.html' -c 'make content' --silent & \
		$(BIN)/onchange 'assets/css/**/*.scss' -c 'make styles' --silent & \
		$(BIN)/onchange 'assets/{fonts,images}/**/*' -c 'make assets' --silent & \
		$(BIN)/wtch --dir build 2>&1 >/dev/null & \
		bin/www

sync:
	@mkdir -p content/students
	@curl -s "$(API)/download" | tar -zxf - -C content/students --strip-components=1

deploy:
	@echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
	@make clean
	@NODE_ENV=production make build
	@(cd build && \
		git init -q . && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git push "git@github.com:$(REPO).git" HEAD:master --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32mhttp://$(DOMAIN)\033[0m"

lint:
	@$(BIN)/xo

# TODO: add tests
test: lint

clean:
	@rm -rf build
clean-deps:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules
content: build/index.html
assets:  build/assets/fonts build/assets/images
styles:  build/assets/bundle.css
scripts: build/assets/bundle.js

#
# Targets
#

node_modules: package.json
	@npm install

build/index.html: bin/build $(CONTENT) $(LAYOUTS)
	@bin/build 2>&1 >&-

build/assets/%: assets/%
	@mkdir -p $(@D)
	@cp -r $< $@

build/assets/bundle.css: $(STYLES)
	@mkdir -p $(@D)
	@bin/build-css assets/css/index.scss $@

build/assets/bundle.js: $(SCRIPTS)
	@mkdir -p $(@D)
	@cp assets/js/index.js $@

#
# Phony
#

.PHONY: develop clean clean-deps
