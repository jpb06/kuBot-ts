Data access layer for kubot

# Purpose

Just an experiment to toy a bit with packaging and tooling.
This is a library containing types to be persisted on a mongodb database and their related manipulation components. 

# Environment

- Targeted for node.js.
- Typescript superset for coding.

# Version history

*  1.0.0 : Naive implementation relying on gulp for project tasking (concat / build / package.json moving).
*  1.1.0 : Using Webpack to do proper bundling for server side code (node.js).
*  1.1.1 : Changing persisted types to typescript interfaces.
*  1.1.2 : Readme issues.
*  1.1.3 : Unordered list for versions history (readme).
*  1.1.4 : Replacing interfaces by classes: was causing issues while consuming the package (interfaces somehow not recognized despite being in typescript declaration files).
*  1.1.41 : Typo in readme.
*  1.1.5 : Using basic deploy - one file per module.
*  1.1.6 : Adding a configuration component to manage mongodb instance url and targeted database.
*  1.1.7 : Namespace PersistedTypes renamed to Types.