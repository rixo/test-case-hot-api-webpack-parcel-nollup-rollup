## Installation

~~~bash
git clone git@github.com:rixo/test-case-hot-api-webpack-parcel-nollup-rollup.git hot-api-test
cd hot-api-test
yarn
~~~

## Usage

~~~bash
yarn start:webpack
# http://localhost:8080

yarn start:parcel
# http://localhost:1234

yarn start:nollup
# http://localhost:8080

yarn start:rollup
# http://localhost:10001
~~~

Change the constant value in `src/a.js`.

Appreciate differences between each methods.

## Conditions

Modules topology:

- `main` imports `b` and `c`
- `b` and `c` both import `a`

~~~
     |-> b (accept) -> |
main |                 | a (changes)
     |-> c (accept) -> |
~~~

Only modules `b` and `c` have an accept handler.

All modules have a dispose handler.

A change happens in module `a`.

## Results

| Does?            | Webpack | Parcel | Nollup | Rollup + Hot |
| ---------------- |:-------:|:------:|:------:|:------------:|
| **Dispose**      |         |        |        |              |
| Run dispose A    | yes     | yes    | yes    | yes          |
| Run dispose B    | yes     | yes    | **no** | yes          |
| Run dispose C    | yes     | **no** | **no** | yes          |
| Run dispose main | no      | no     | no     | no           |
| **Accept**       |         |        |        |              |
| Run accept B     | no      | yes    | yes    | yes          |
| Run accept C     | no      | **no** | **no** | yes          |
| **Rerun**        |         |        |        |              |
| Rerun A          | yes     | yes    | yes    | yes          |
| Rerun B          | yes     | yes    | yes    | yes          |
| Rerun C          | yes     | **no** | **no** | yes          |
| Rerun main       | no      | no     | no     | no           |
| **Rebind**       |         |        |        |              |
| Rebind B         | yes     | yes    | yes    | yes          |
| Rebind C         | yes     | no     | no     | yes          |
| Rebind main      | **no**  | **no** | **no** | yes          |

**In bold:** This goes against my own expectations.

Last column is using my WIP [rollup-plugin-hot](https://github.com/rixo/rollup-plugin-hot). It leverages [SystemJS](https://github.com/systemjs/systemjs) as a module loader and uses [WIP SystemJS reload extra](https://github.com/systemjs/systemjs/pull/2014). It's SystemJS and the linked PR that implement update of modules' bindings.

### Webpack

Launch:

~~~
[HMR] Waiting for update signal from WDS...
a.js := a
b.js: a
c.js: a
main.js
[WDS] Hot Module Replacement enabled.
[WDS] Live Reloading enabled.
... (unrelated compilation warning ignored)
main.js: b(a) c(a)
~~~

After changing `a.js`:

~~~
[WDS] App updated. Recompiling...
... (unrelated compilation warning ignored)
[WDS] App hot update...
[HMR] Checking for updates on the server...
dispose c.js
dispose b.js
dispose a
a.js := a UPDATED
b.js: a UPDATED
c.js: a UPDATED
[HMR] Updated modules:
[HMR]  - ./src/a.js
[HMR]  - ./src/b.js
[HMR]  - ./src/c.js
[HMR] App is up to date.
main.js: b(a) c(a)
~~~

### Parcel

Launch:

~~~
a.js := a
b.js: a
c.js: a
main.js
main.js: b(a) c(a)
~~~

After changing `a.js`:

~~~
dispose a
a.js := a UPDATED
dispose b.js
b.js: a UPDATED
accept b.js a UPDATED
main.js: b(a) c(a)
~~~

### Nollup

Launch:

~~~
a.js := a
b.js: a
c.js: a
main.js
main.js: b(a) c(a)
~~~

After changing `a.js`:

~~~
dispose a
accept b.js a
a.js := a UPDATED
b.js: a UPDATED
main.js: b(a) c(a)
~~~

### Rollup Hot

Launch:

~~~
[HMR] Enabled
a.js := a
b.js: a
c.js: a
main.js
main.js: b(a) c(a)
~~~

After changing `a.js`:

~~~
[HMR] Rebuilding...
dispose a
a.js := a UPDATED
dispose b.js
b.js: a UPDATED
accept b.js a UPDATED
dispose c.js
c.js: a UPDATED
c.js:20 accept c.js a UPDATED
[HMR] Up to date
main.js: b(a UPDATED) c(a UPDATED)
~~~

### Nollup over rolup-plugin-hot compat mode

Launch:

~~~
a.js := a
b.js: a
c.js: a
main.js: b(a) c(a)
~~~

After changing `a.js`:

~~~
dispose a
accept b.js a
a.js := a UPDATED
b.js: a UPDATED
main.js: b(a) c(a)
~~~
