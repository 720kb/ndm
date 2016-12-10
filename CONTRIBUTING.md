###Contributing Guidelines

If you are so kind to help and support us, please consider following these guidelines before sending PRs or commits:

- No lint errors (eslint, jscs, scss, pug etc ...)

- No formatting errors (if you use [Atom](https://atom.io/) you just have to use the IDE default settings for formatting code and you are synced)

- Use ONLY English language (everywhere in the code and outside the code)

- No English typos (it can happen of course, just try to avoid them as much as possible)

- No comments inside the code

- Just use .lint files in your IDE (don't remove or disable the linters: .eslintrc, .jscslint and so on)

- Just do not disable linters with inline comments (or at least remove comments as you want to PR) but be sure there are no errors in the end.

- As you finished to code your changes always make a new clean install (`rm -Rf node_modules/ && npm install`)
  , Then run the app and test all your changes deeply (`npm start`)
  
- Be sure to always update your node and npm global version before starting coding your changes/fixs

- If you are not sure or you have any doubt about what you are doing/changing: consider opening an issue and ask before going to PR or commit

- If your changes are radicals, please open an issue or contact us [here](https://gitter.im/720kb/ndm), so that we can discuss it togheter before everything goes on. By radicals we can list for example: 
   - created new tasks
   - changed the HTML|CSS layout
   - changed UI and UX behavior
   - changed logo or icons or graphics in general
   - changed package.json by changing | updating | removing dependencies
   - added new js files to the folder structure
   - changed the folders structure
   - rewrote js file/s for a 50% and up
   - .... others to come, but these are mostly very important changes

These guidelines are not imperative, it's just the simplest method to be synced with you, you can PR any file in the repo, and this same file too :ok_hand:

Thank you!
