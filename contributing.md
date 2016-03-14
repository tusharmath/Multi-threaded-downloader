# Contribution Guidelines
[standard]:     http://standardjs.com
[commitizen]:   https://github.com/commitizen/cz-cli
Before submitting a patch make sure —

0. Use `npm update` to load the latest dependencies

0. All tests are passing. If its a bug add a new test to mimic the bug.

0. Follows [Standard][standard] code style.

0. Commits are in `<type>(<scope>): <subject>` format. Where type can be — `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `revert`.
   
   Best practice would be to use [commitizen][commitizen] to make sure the commit is in standard format.
   ```
   npm install commitizen -g
   git cz -a
   ```
