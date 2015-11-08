
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT       = 8080
HOST      ?= localhost
NODE_ENV  ?= development

LAYOUTS    = $(shell find ./layouts -type f -name '*.html')
CONTENT    = $(shell find ./content -type f -name '*.md' -or -type f -name '*.yml')

IMAGES     = $(shell find ./assets -type f -name '*.jpg' -or -type f -name '*.png' -or -type f -name '*.gif')
STYLES     = $(shell find ./assets -type f -name '*.scss')
SCRIPTS    = $(shell find ./assets -type f -name '*.js')

BROWSER_SUPPORT = "last 2 versions"


#
# Tasks
#

build: node_modules content assets styles
start: build
	@PORT=$(PORT) bin/www

watch: install
	@make -j4 watch-serve watch-html watch-css watch-js
watch-serve:
	@$(BIN)/serve --port $(PORT) build | $(BIN)/wtch --dir build | $(BIN)/garnish
watch-html:
	@$(BIN)/chokidar 'content/**/*.{md,yml}' 'layouts/**/*.html' -c 'make content' --silent
watch-css:
	@$(BIN)/chokidar 'assets/css/**/*.scss' -c 'make styles' --silent
watch-js:
	@true



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
styles:  build/assets/bundle.css
scripts: build/assets/bundle.js

#
# Targets
#

node_modules: package.json
	@npm install

build/index.html: bin/build $(CONTENT) $(LAYOUTS)
	@bin/build 2>&1 >&-

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
