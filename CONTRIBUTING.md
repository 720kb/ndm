###Contributing Guidelines

If you are so kind to help and support us, please consider following these guidelines before sending PRs or commits:

- No lint errors (eslint, jscs, scss, pug etc ...)

- No formatting errors (if you use [Atom](https://atom.io/) you just have to use the IDE default settings for formatting code and you are synced)

- Just use .filerc files in your IDE (don't remove or disable the linters: .eslintrc, .jscslint and so on)

- Just do not disable linters with inline comments (or at least remove comments as you want to PR) but be sure there are no errors in the end.

- As you finished to code your changes always make a new clean install (`rm -Rf node_modules/ && npm install`)
  , Then run the app and test all your changes deeply (`npm start`)
  
- Be sure to always update your node and npm global version before starting coding your changes/fixs

- If you are not sure or you have any doubt about what you are doing/changing: consider opening an issue and ask before going to PR or commit


Thank you!
