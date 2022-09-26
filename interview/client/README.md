<div style="text-align: center">

  <img width="300px" src="/client/src//assets/images/logo_ROODEO.svg" />

Assessment and test platform by @Oostaoo Consulting.
This is the interview module of the project.

![GitHub pull requests](https://img.shields.io/github/issues-pr/jeremielenoir/oostaoo-coding-adventure) ![GitHub contributors](https://img.shields.io/github/contributors-anon/jeremielenoir/oostaoo-coding-adventure) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/jeremielenoir/oostaoo-coding-adventure/develop)

</div>

---

## Scripts

| Script commands | Description                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn start`    | Start the project                                                                                                                                                                     |
| `yarn test`     | Run tests on files which were changed since last commit. You can get the test coverage with the `yarn test -- --coverage` command                                                     |
| `yarn lint`     | Call ESLint (Air'bnb rules). ESLint will automatically be called on each commit thanks to Husky. Minor ESLint warnings can be fixed with `yarn lint:fix` (mostly related to Prettier) |

---

## Issues and workflow

Please refer to the [repository Project](https://github.com/jeremielenoir/oostaoo-coding-adventure/projects/1) to know all project related issues.

### When you want to work on an issue :

- refer to the To Do column and select the issue you want to work on
- select your GitHub profile on the assignees category of the issue, put the In Progress label, and move the issue in the In Progress column
- create a branch from the develop branch and use the correct naming convention with the issue ticket number and the name of the issue (i.e. `Feature/#505/UPDATE_ALL_TESTS`).

### Review and merge when the issue is resolved :

- commit and push your code
- do a pull request on the Roodeoo repository, don't forget about assigning a reviewers, an assignee and a Ready For Review label. Move the issue in the Code Review column in Project
- if the pull request is ok and merged, close the issue then pull the changes on your local develop branch.

You can create new issues when needed. Please add a clear and descriptive comment about the issue.

---

## Interview client

Contains the video stream and chat.

> Each page and component have their own folder containing the .jsx, .css and test files.

> Socket logic contained in Context files for stream and chat.

<details>
  <summary style="font-weight: 700; font-size: 20px">
    Pages (click to expand)
  </summary>
  <h4>InterviewHomePage</h4>
  <p>Main page. Displays the Preview or Interview component.</p>
  <h4>LoggedOffPage</h4>
  <p>Disconnection page. User lands here when he leaves the interview.</p>
</details>
<details>
  <summary style="font-weight: 700; font-size: 20px">
    Components (click to expand)
  </summary>

  <h4>ChatSection</h4>
  <p>Displays all chat messages and message input. Uses the Message component.</p>
  <p>Props : toggleMessage (setState).</p>

  <h4>CommandsBar</h4>
  <p>Displays the command bar containing the mute/hide/disconnect buttons.</p>
  <p>Props : toggleParticipant (setState), toggleMessage (setState).</p>

  <h4>Interview</h4>
  <p>Displays both user and partner videos, the chat, user list and the command bar. Uses the ChatSection, UsersSection and CommandBar components.</p>
  <p>Props : none</p>

  <h4>Message</h4>
  <p>Displays a line of text in chat.</p>
  <p>Props : text (string), date (string).</p>

  <h4>ModalLeaveInterview</h4>
  <p>Displays a modal to confirm/cancel leaving the interview.</p>
  <p>Props : open (boolean), handleClose (function).</p>

  <h4>Preview</h4>
  <p>Displays the interview preview, only the user camera and interview confirmation.</p>
  <p>Props : none.</p>

  <h4>UserLine</h4>
  <p>Displays one user in the UsersList component.</p>
  <p>Props : name (string), secondary (string, unused for now).</p>

  <h4>UsersList</h4>
  <p>Displays the list of all users. Uses the UserLine component</p>
  <p>Props : secondary (string, unused for now).</p>

  <h4>UsersSection</h4>
  <p>Displays the window containing all users present in chatroom. Uses the UsersList component.</p>
  <p>Props : secondary (string, unused for now).</p>
</details>

<details>
  <summary style="font-weight: 700; font-size: 20px">
    Commons (click to expand)
  </summary>

  <h4>dico.js</h4>
  <p>Contains socket variables.</p>

  <h4>routes.js</h4>
  <p>Contains all routes for the router.</p>

  <h4>StreamContext.js</h4>
  <p>Context API. Contains and manages socket logic for the video stream.</p>

  <h4>SocketContext.js</h4>
  <p>Context API. Contains and manages socket logic for the chat.</p>
</details>

---

## Interview server

Contains all socket logic and room management.
