
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

DOMAIN     = ysdn2016.com
REPO       = ysdn-2016/ysdn-2016.github.io
BRANCH     = $(shell git rev-parse --abbrev-ref HEAD)

API        = https://api.ysdn2016.com

#
# Tasks
#

build: node_modules content assets styles
start: build
	@bin/www

watch: install build
	@$(BIN)/onchange 'content/**/*.{md,yml}' 'layouts/**/*.html' -- make content & \
		$(BIN)/onchange 'assets/css/**/*.scss' -- make styles & \
		$(BIN)/onchange 'assets/{fonts,images}/**/*' -- make assets & \
		$(BIN)/wtch --dir build 2>&1 >/dev/null & \
		bin/www & wait

sync:
	@mkdir -p content/students
	@curl -s "$(API)/download" | tar -zxf - -C content/students --strip-components=1

deploy:
	@if [[ "$(BRANCH)" != "production" ]]; then sleep 0.5 && echo "\n\033[0;31mERROR:\033[0m Deployments can only happen in the \033[0;33mproduction\033[0m branch\nMerge your changes into \033[0;33mproduction\033[0m and try again.\n" && tput bel && exit 1; fi
	@echo "Deploying branch \033[0;33mproduction\033[0m to Github pages..."
	@make clean
	@NODE_ENV=production make build
	@(cd build && \
		echo "$(DOMAIN)" > CNAME && \
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

comb:
	@csscomb assets/css -v

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
	@bin/build

build/assets/%: assets/%
	@mkdir -p $(@D)
	@cp -r $< $@

build/assets/bundle.css: $(STYLES)
	@mkdir -p $(@D)
	@sassc -m assets/css/index.scss $@
	@$(BIN)/postcss --use autoprefixer $@ -o $@

build/assets/bundle.js: $(SCRIPTS)
	@mkdir -p $(@D)
	@cp assets/js/index.js $@

#
# Phony
#

.PHONY: develop clean clean-deps
