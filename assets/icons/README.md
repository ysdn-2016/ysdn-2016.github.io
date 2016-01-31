
# Generating Icons

1. Add your icon the `icons.sketch` as a new artboard. Make sure the name of the artboard is the name that you'd like to reference the icon by in CSS.
2. Export all icons as svgs to a folder called `exports` in this directory (so you should have `app/icons/exports/*.svg`).
3. Run `make clean`
4. All done! Next time you run `make watch`, the icons will be updated.

Classes for your CSS can be found in [_icons.scss](https://github.com/ysdn-2016/ysdn-2016.github.io/blob/develop/assets/css/partials/_icons.scss).
