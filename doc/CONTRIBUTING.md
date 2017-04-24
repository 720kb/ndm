# Contributing Guidelines

If you are so kind to help and support us, please consider following these guidelines before sending PRs or commits:

- Possibly no lint errors (eslint, jscs, scss, pug etc ...) if accidentally you find some then feel free to fix it as you go.

- Possibly no formatting errors (if you use [Atom](https://atom.io/) you just have to use the IDE default settings for formatting code and you are synced)

- Possibly use ONLY English language (everywhere in the code and outside the code)

- Possibly no English typos (it can happen of course, just try to avoid them as much as possible)

- Possibly no comments inside the code

- Possibly, just use .lint files in your IDE (don't remove or disable the linters: .eslintrc, .jscslint and so on)

- Possibly, just do not disable linters with inline comments (or at least remove comments as you want to PR) but be sure there are no errors in the end.

- If you are editing the GUI style (CSS) do not change or edit .pug/.html files to fit your style; CSS must fit the html structure and not the opposite.

- As you finished to code your changes always make a new clean install (`rm -Rf node_modules/ && npm install`)
  , Then run the app and test all your changes deeply (`npm start`)
  
- Be sure to always update your node version to LTS before to start coding your changes/fixs

- If you are not sure or you have doubts about what you are doing/changing: consider opening an issue and ask, before to go PR or commit or simply contact us [here]

- If your changes are radicals, please open an issue or contact us [here](https://gitter.im/720kb/ndm), so that we can discuss it togheter before everything goes on. By radicals we can list for example: 
   - changed the HTML layout
   - changed UI and UX behaviors
   - changed logo or icons or graphics in general
   - changed package.json by changing | updating | removing dependencies
   - added new js files to the folder structure
   - changed the project folders structure
   - rewrote js file/s for a good 50% and up

These guidelines are not imperative, it's just the simplest method to be synced with you, you can PR any file in the repo, and this same file too :ok_hand:

Look! One thing, to be absolutely clear: contributing on the ***ndm*** project, and in general on open source projects, does not mean to get paid and in any currency or good for the time/work/service. That's your time and you provide it on your own choice; it doesn't mean neither to get hired or to get a job in a company. By reading these contribution guidelines and before to contribute on the **ndm** project you declare you have read and accepted these conditions, thank you.

Thank you for listening :speaker:! We really would love and hope to have you on board, to have some fun and share new tricks and tips, each others of course!

Bests.
