
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
MARKDOWN   = $(shell find ./content -type f -name '*.md')

IMAGES     = $(shell find ./assets -type f -name '*.jpg' -or -type f -name '*.png' -or -type f -name '*.gif')
STYLES     = $(shell find ./assets -type f -name '*.scss')
SCRIPTS    = $(shell find ./assets -type f -name '*.js')

BROWSER_SUPPORT = "last 2 versions"


#
# Tasks
#

build: node_modules content assets styles
	@true

develop: install
	@$(BIN)/serve --port $(PORT) build

lint:
	@xo
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

build/index.html: bin/build $(MARKDOWN) $(LAYOUTS)
	@bin/build 2>&1 >&-

build/assets/bundle.css: $(STYLES)
	@mkdir -p $(@D)
	@cp assets/css/index.css $@

build/assets/bundle.js: $(SCRIPTS)
	@mkdir -p $(@D)
	@cp assets/js/index.js $@

#
# Phony
#

.PHONY: develop clean clean-deps
