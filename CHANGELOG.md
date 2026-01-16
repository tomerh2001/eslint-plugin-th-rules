## [3.1.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v3.1.1...v3.1.2) (2026-01-16)


### Bug Fixes

* fixed typescript errors ([81919dd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/81919dd09a81ade0b19f35b2e6fcf4bf7e74190b))
* refactor rules definition in coreBase and add type declaration for eslint-plugin-lodash ([21466ec](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/21466ecd3e78a9606b35239f70d482f8d0fce35b))

## [3.1.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v3.1.0...v3.1.1) (2026-01-16)


### Bug Fixes

* update react-hooks configuration path in recommendedReact and clean up xo.config ([1071c9d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/1071c9d7872cd51514502a2d68346b31da084b72))

# [3.1.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v3.0.0...v3.1.0) (2026-01-16)


### Features

* enhance configuration exports and add XO config for recommended settings ([958b93b](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/958b93b5c096494420334f8e63a8c7fc3cd29f04))
* integrate @leancodepl/resolve-eslint-flat-config for improved ESLint configuration management ([3a3d2b9](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/3a3d2b9dc1f86ec7b088c9069449a1250225ca4a))

# [3.0.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.8.0...v3.0.0) (2026-01-15)


### Bug Fixes

* correct command syntax for running tests in CI workflow ([bd526b0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/bd526b0db1c53b2d5dede7228aca477b4b5429d6))
* correct command syntax for running tests in CI workflow ([12c4bb0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/12c4bb06e408525a4193370e0d14091b0f9eb51d))


### Features

* update TypeScript configuration and remove unused files ([255b4d5](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/255b4d55c82e97ccd354a70f41957d216f1da3af))


### BREAKING CHANGES

* Upgraded all project to typescript and modernized the codebase

# [2.8.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.7.1...v2.8.0) (2026-01-15)


### Bug Fixes

* update import statement for rules to include file extension ([b5fe322](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/b5fe3220d37307bc28e5944649903aca31b8ad1e))
* update test command to include 'tests' argument ([ea7a879](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/ea7a8798078efb0610c1505e3361b6116714efe0))


### Features

* add tests for no-boolean-coercion and no-comments rules; update TypeScript configuration and dependencies ([60e2bb5](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/60e2bb5d6c94b10019d73eea863d5fd224b220ac))
* add tests for no-destructuring rule with valid and invalid cases ([7d1c2c2](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/7d1c2c2e76d73d7084fa50490a8a48ce4fbd4c82))
* add tests for schemas-in-schemas-file rule with valid and invalid cases ([7b4813e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/7b4813e7429ff5c3943196b8ca1b17dca709d62c))
* add tests for top-level-functions rule with valid and invalid cases ([1cd5b71](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/1cd5b717f42d66c51c5282dac1c38a43d116cd65))
* add tests for types-in-dts rule with valid and invalid cases ([0e8da0e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/0e8da0efa922fda75ef6cc9f41b02ba968df683c))
* refactor rule imports and enhance README documentation ([762d7df](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/762d7df5a2fadbfce0c042553da6b2c14890cdab))
* remove deprecated ESLint verification step from CI workflow ([73464a1](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/73464a187a29b8c99f79e7edb858e9f7fa0c80e0))
* remove deprecated verify script and update rule imports; add tests for new rules ([2843660](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/28436605209757babe5ce6a95714d8294722f737))
* restructure ESLint configurations and enhance documentation ([7ef8968](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/7ef89685bc54c9bc80e9351342bb9d88757ff1ae))
* switch from Bun to Yarn for dependency management and build processes ([55211eb](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/55211ebfa69f0b54480e9b0c55938ea07fd314b2))
* update no-default-export rule logic and add comprehensive tests ([16c08a3](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/16c08a3a2930ffeda0181c12724aad4154c42856))
* update TypeScript configuration and remove unused files ([60cc4ba](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/60cc4baba17d5c22d2133ead8cfd557caa9dd486))

## [2.7.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.7.0...v2.7.1) (2026-01-14)


### Bug Fixes

* update no-boolean-coercion rule to enforce explicit checks with negation ([a9e7752](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/a9e77524035efbd023330168e2d070a6419cde70))

# [2.7.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.6.1...v2.7.0) (2026-01-14)


### Features

* remove prefer-explicit-nil-or-empty-check rule and associated tests ([2aded48](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/2aded48d6f7df8d205cf7817afe3c0fdca39601c))

## [2.6.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.6.0...v2.6.1) (2026-01-14)


### Bug Fixes

* refactor prefer-explicit-nil-or-empty-check rule and add tests for implicit checks ([d153066](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/d1530664708cf31025d5ebf1b92f6b68401c5448))

# [2.6.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.5.1...v2.6.0) (2026-01-14)


### Features

* add prefer-explicit-nil-or-empty-check rule and update dependencies ([c8fb3da](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/c8fb3da5be98caf0c31a50fa72f16b07e410eff6))

## [2.5.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.5.0...v2.5.1) (2026-01-14)


### Bug Fixes

* add prefer-is-empty rule to enforce _.isEmpty over length comparisons and update documentation ([06ee673](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/06ee673a0fde79b7cc2af1f72807d9716576310c))

# [2.5.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.4.0...v2.5.0) (2026-01-14)


### Features

* add prefer-is-empty rule to enforce _.isEmpty over length comparisons and update documentation ([5bc671f](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/5bc671f35599d69a5a1432d173df408082da2db6))

# [2.4.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.3.0...v2.4.0) (2026-01-14)


### Features

* fixed git tags ([822f503](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/822f5033769f89fabbd6cf7177ccef74311ec2e5))

# [2.2.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.1.1...v2.2.0) (2026-01-14)


### Bug Fixes

* enhance no-boolean-coercion rule with detailed messages and update tests ([c79ad92](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/c79ad921e2a6c4dabe0f0e74b80393b01525c3d7))
* enhance no-boolean-coercion rule with detailed messages and update tests ([686d620](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/686d6204bd46f757a4490656521b1094f3e3237e))


### Features

* created new rule no-boolean-coercion ([f9b0803](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f9b08039f6275e363da10e8e3ca49fb75ad2e48a))

# [2.2.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.1.1...v2.2.0) (2026-01-14)


### Bug Fixes

* enhance no-boolean-coercion rule with detailed messages and update tests ([686d620](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/686d6204bd46f757a4490656521b1094f3e3237e))


### Features

* created new rule no-boolean-coercion ([f9b0803](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f9b08039f6275e363da10e8e3ca49fb75ad2e48a))

## [2.1.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.1.0...v2.1.1) (2026-01-10)


### Bug Fixes

* update base recommended rules to disable specific TypeScript and lodash rules ([6b4c240](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/6b4c24062199bd8dda59407a844ae545903f8ddc))

# [2.1.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.0.4...v2.1.0) (2026-01-09)


### Features

* migrate to ES module syntax and update dependencies; remove unused config ([b225e2c](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/b225e2c0260152009c011a5b445ed2c67f665ce5))

## [2.0.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.0.3...v2.0.4) (2026-01-08)


### Bug Fixes

* disable 'security/detect-unsafe-regex' rule in base recommended configuration ([9e8489c](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9e8489cc627fb6de8884f5c95375165a0416e1c1))

## [2.0.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.0.2...v2.0.3) (2026-01-08)


### Bug Fixes

* update dependencies for improved compatibility ([9415af9](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9415af9ac3ad24fcd606b7ed5455bf307c55fb69))

## [2.0.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.0.1...v2.0.2) (2026-01-07)


### Bug Fixes

* update 'recommended-react' config to use 'plugin:react/jsx-runtime' ([25a1ef1](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/25a1ef18ce70104e8bb4521f265157270db79896))

## [2.0.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v2.0.0...v2.0.1) (2026-01-07)


### Bug Fixes

* modify 'lodash/import-scope' rule in base recommended configuration ([4add1ee](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/4add1ee31f966875bc8c848328676819548a21fe))

# [2.0.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.21.0...v2.0.0) (2026-01-07)


### Features

* moved to flat ESLint config ([4b8df27](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/4b8df27d291afad906e2527c96b707c2703c64a3))


### BREAKING CHANGES

* moved to flat ESLint config

# [1.21.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.6...v1.21.0) (2026-01-07)


### Features

* add eslint-plugin-lodash as a dependency and integrate it into the configuration ([6d32f3d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/6d32f3d3dde6dab55cfcd13a7c85146c61eaf522))

## [1.20.6](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.5...v1.20.6) (2026-01-06)


### Bug Fixes

* remove unused eslint-disable comments and plugins from index.js ([9303787](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/930378752cdd44442eda4c020c1d325769aad562))

## [1.20.5](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.4...v1.20.5) (2026-01-06)


### Bug Fixes

* update GitHub Actions workflow and add ESLint verification script ([9e3c40e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9e3c40ee1c5500589e5463d997c832165666e6f6))

## [1.20.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.3...v1.20.4) (2026-01-06)


### Bug Fixes

* fixed xo error ([056e708](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/056e7083ac33a4727b8664ac28b6838d5070de3f))

## [1.20.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.2...v1.20.3) (2026-01-06)


### Bug Fixes

* update dependencies in yarn.lock ([2059b35](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/2059b3503efb1515843d822f3d386d58666b1864))

## [1.20.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.1...v1.20.2) (2026-01-06)


### Bug Fixes

* refactor config handling to use flatConfigs for better structure ([22d64f2](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/22d64f20a5d5b64ae0676d6afcd87e2790f5ef4f))

## [1.20.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.20.0...v1.20.1) (2026-01-06)


### Bug Fixes

* fixed xo errors ([633d5e0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/633d5e08a22feddaecf925bc685798bc23ea795c))

# [1.20.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.19.3...v1.20.0) (2026-01-06)


### Features

* **eslint:** :boom: migrated to ESLint flat configs ([0af8a5e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/0af8a5e49026af3145924363949cdb2978886dbf))

## [1.19.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.19.2...v1.19.3) (2026-01-06)


### Bug Fixes

* remove styles-in-styles-file rule and update configs ([e6779c2](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/e6779c2d6bf367fc9474c0ded5977b0a03ad159f))

## [1.19.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.19.1...v1.19.2) (2026-01-05)


### Bug Fixes

* clean up JSDoc comments and improve code readability in no-destructuring rule ([f7c2547](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f7c2547e71d41d19c874b1713c62bed25018803c))

## [1.19.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.19.0...v1.19.1) (2026-01-05)


### Bug Fixes

* remove jsdoc plugin from recommended configs and clean up extends ([de220ac](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/de220acd3d0c80340c7ee9b5bc2bfe2967c1c4c5))

# [1.19.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.18.0...v1.19.0) (2026-01-05)


### Features

* Added force for jsdoc in recommended configs ([6729b7a](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/6729b7a4804f8a63356aff9e2ceef57119b7075d))

# [1.18.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.17.1...v1.18.0) (2026-01-05)


### Features

* add 'schemas-in-schemas-file' rule to enforce Zod schema declarations in dedicated files ([92b54a0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/92b54a0b9ca4197c4e92c268d7d0cf0f8efc83cf))

## [1.17.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.17.0...v1.17.1) (2026-01-05)


### Bug Fixes

* improve style file validation messages and simplify code structure ([5c165b4](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/5c165b4fcbc103df752e7c56f988c725dae6a62c))

# [1.17.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.16.0...v1.17.0) (2026-01-05)


### Features

* add 'styles-in-styles-file' rule to enforce React-Native styles in dedicated files ([eca8af0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/eca8af0850aa197a35fb47cf08a9f04839a6a3cb))

# [1.16.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.6...v1.16.0) (2026-01-05)


### Features

* add new rule 'types-in-dts' to enforce TypeScript type declarations in .d.ts files ([00c4769](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/00c4769f9a025642f7c72023df1dea82dbf33e72))

## [1.15.6](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.5...v1.15.6) (2024-12-30)


### Bug Fixes

* enhance top-level functions rule to support async and export keywords ([cca9ceb](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/cca9cebe77fa01820048a55c444e55bd297b883c))

## [1.15.5](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.4...v1.15.5) (2024-12-30)


### Bug Fixes

* enforce naming conventions for top-level functions and improve error messages ([c50194d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/c50194d3ad4c2ef98387d3bbee8d06a30e2aa458))

## [1.15.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.3...v1.15.4) (2024-12-30)


### Bug Fixes

* improve top-level functions rule to support single-expression functions ([da75c58](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/da75c5823445b54eac9ab6cc7717e007e8a797a6))

## [1.15.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.2...v1.15.3) (2024-12-30)


### Bug Fixes

* enhance top-level functions rule to handle arrow and function expressions ([0bdcc2c](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/0bdcc2cbe2bd9e790ca2965001c786e3a8518a60))

## [1.15.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.1...v1.15.2) (2024-12-30)


### Bug Fixes

* implement top-level functions rule with tests for ESLint ([c19c451](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/c19c4515b66b314cc327ef84c674a1324ad7d204))

## [1.15.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.15.0...v1.15.1) (2024-12-30)


### Bug Fixes

* enable top-level functions rule in ESLint configuration ([ce694ad](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/ce694ad302388f13e04af8e3d951c8cf00c0603f))

# [1.15.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.14.1...v1.15.0) (2024-12-30)


### Features

* add top-level functions rule and update ESLint configuration ([49e5ebb](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/49e5ebbf597615e508a8b0067d8ca263d73f0469))

## [1.14.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.14.0...v1.14.1) (2024-12-30)


### Bug Fixes

* update dependencies and disable specific ESLint rules ([9cb636b](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9cb636b127add46aaa8926a73fdbd0e49f897c0e))

# [1.14.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.13.4...v1.14.0) (2024-09-11)


### Features

* Added `recommended-react` config ([2238f59](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/2238f59649a1a3ad7368aa6a2feaca0e98391d2f))

## [1.13.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.13.3...v1.13.4) (2024-08-22)


### Bug Fixes

* Remove no-comments from plugins list ([e3df83f](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/e3df83ff4e6a0497058b4080bb884d340f58fc13))

## [1.13.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.13.2...v1.13.3) (2024-08-21)


### Bug Fixes

* removed named functions ([a1c87b0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/a1c87b02dbb478d953f972bc95df3a2888b5e28b))

## [1.13.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.13.1...v1.13.2) (2024-08-19)


### Bug Fixes

* Remove named-functions rule and related files ([9d0f23d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9d0f23d1f705eb3ddbe41e9def152e182729e1d4))

## [1.13.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.13.0...v1.13.1) (2024-08-19)


### Bug Fixes

* Update named-functions rule to enforce named function declarations ([e2c9b5d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/e2c9b5d5f96030278b2900adbf940363c4648bdd))

# [1.13.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.12.0...v1.13.0) (2024-08-19)


### Features

* Add named-functions rule to recommended and recommended-typescript configs ([3f88f76](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/3f88f76460d7bce934f83da68c555c9795fdfe92))

# [1.12.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.11.4...v1.12.0) (2024-08-19)


### Features

* created no-comments rule ([82dda49](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/82dda49f7f4708b68b8a4bd81e5af3ca84519a43))

## [1.11.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.11.3...v1.11.4) (2024-08-19)


### Bug Fixes

* Update regex pattern for disallowed comments ([11d9e1b](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/11d9e1bde0382460defb252701c20769f30e67e6))

## [1.11.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.11.2...v1.11.3) (2024-08-19)


### Bug Fixes

* Update regex pattern for disallowed comments ([afa6799](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/afa679935417a2df008b111b06c8f4ebff7a1691))

## [1.11.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.11.1...v1.11.2) (2024-08-19)


### Bug Fixes

* allow eslint ([20f37ab](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/20f37abb18100b6bf71a2631da7f02bead187a4c))

## [1.11.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.11.0...v1.11.1) (2024-08-19)


### Bug Fixes

* allow eslint-disable comments ([e210edd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/e210edd0510a9b4575953d3ee039f8d70ec3ef89))

# [1.11.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.10.0...v1.11.0) (2024-08-19)


### Features

* added no comments ([8fcc0b7](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/8fcc0b7f7d0e0866584d478093aa835cf55acef1))

# [1.10.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.9.0...v1.10.0) (2024-08-02)


### Features

* Added eslint-plugin-security ([37ec7d1](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/37ec7d1267c18452199fa9a4c5810f1eb1246201))

# [1.9.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.8.1...v1.9.0) (2024-06-15)


### Features

* created separate configs for typescript and non-typescript configs ([13f17df](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/13f17dfad0182c9437e38a51adb37c1b15153d71))

## [1.8.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.8.0...v1.8.1) (2024-06-15)


### Bug Fixes

* Disable TypeScript ESLint strict rules and unsafe checks ([bf186fb](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/bf186fbc8216a520b59e24e7861c47ee0f281680))

# [1.8.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.7.0...v1.8.0) (2024-06-15)


### Bug Fixes

* Remove eslint-plugin-github from recommended config ([989a59f](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/989a59f47ff67864499a8ee7f34354feccae71a9))


### Features

* Added typescript-eslint strict rules ([be91f38](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/be91f38d1f2a1f452d0b92755d58ce728b544066))

# [1.7.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.6.1...v1.7.0) (2024-06-15)


### Features

* Add eslint-plugin-github to recommended config ([f502310](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f50231096d48d007f24e069c89495cc2b6de8222))

## [1.6.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.6.0...v1.6.1) (2024-06-14)


### Bug Fixes

* Update eslint-plugin-sonarjs to latest version ([84e41be](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/84e41be6dc48062c64c2a2051dbc7e99865b7d94))

# [1.6.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.5...v1.6.0) (2024-06-14)


### Features

* Added eslint-plugin-sonarjs to recommended config ([13176f3](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/13176f3ededa543f3b5f05789a5deed6f0f5cdb1))

## [1.5.5](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.4...v1.5.5) (2024-06-14)


### Bug Fixes

* fixed CI ([36f1e36](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/36f1e36c95debb7360455bf0d00cdbffd07be77b))

## [1.5.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.3...v1.5.4) (2024-06-14)


### Bug Fixes

* removed unused configs ([cbac1d8](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/cbac1d8bb207c612d93f9cd895829fe12368a77d))
* Update eslint and related dependencies to latest versions ([a39e785](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/a39e78548b32ee6edd344166cc406e2139a6dcfd))
* Update eslint and related dependencies, disable specific rules, and fix linting issues ([69d2814](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/69d281416b8366c670ef9cd9051e39edf49f0731))

## [1.5.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.2...v1.5.3) (2024-02-26)


### Bug Fixes

* Update devDependencies and peerDependencies in package.json ([5fd3210](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/5fd3210ea359915312fced3f65b57ae3f2a8d2c8))

## [1.5.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.1...v1.5.2) (2024-02-26)


### Bug Fixes

* Update environment configuration in index.js ([277871c](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/277871cc4ff71659fa1e476fd463c39893878797))

## [1.5.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.5.0...v1.5.1) (2024-02-26)


### Bug Fixes

* fixed ([9730e96](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/9730e96ff296ccd4afbc278fefd176f2684b89cb))

# [1.5.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.4.2...v1.5.0) (2024-02-26)


### Bug Fixes

* Add ESLint configurations for JSDoc and React ([45b6297](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/45b62978da758e4ebbf62780e74595393c38800b))


### Features

* adding basic, recommended and all, also planning to add a recommended-react and recommended-react-native variants in the future ([85e54dd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/85e54ddabe928aafadb83c4118ff5da390654260))

## [1.4.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.4.1...v1.4.2) (2024-02-26)


### Bug Fixes

* fixed name of no-destructuring rule ([30ab24a](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/30ab24aec8b84cda665c7fc43920f2625a2f8d83))

## [1.4.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.4.0...v1.4.1) (2024-02-26)


### Bug Fixes

* fixed a bug with the no-default-export auto fix ([fabd4bd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/fabd4bdc51d7290baf6807e8255acdfd90e81f03))

# [1.4.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.3.2...v1.4.0) (2024-02-23)


### Features

* Update package name and plugin references ([2fd90bd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/2fd90bd5873e541ea0e4ce05c7872732636753ec))

## [1.3.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.3.0...v1.3.1) (2024-02-23)


### Bug Fixes

* fixed package name ([4e006ab](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/4e006ab95cb8daa4310c43adbdd24c3be82b34b4))

# [1.3.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.2.0...v1.3.0) (2024-02-23)


### Bug Fixes

* renamed recommended configuration to all ([f11d297](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f11d297861da5b9234ddebf18c1ea4f52099b7b6))
* Update plugin and rule names in configs ([476b081](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/476b0813aaecfe717291ac44fdd9c661a4356693))


### Features

* updated readme ([3903d35](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/3903d354c2d4ba367258aa0cd80501db080cf595))

# [1.2.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.1.4...v1.2.0) (2024-02-23)


### Features

* :sparkles: Created a recommended configuration ([4c81e02](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/4c81e027ef00ab06a4c69ef32857093fcb06fb3b))

## [1.1.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.1.3...v1.1.4) (2024-02-23)


### Bug Fixes

* Update lib/index.js to import all rules in lib/rules ([d4f3183](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/d4f3183de27b530a7f62fc1670055915641d7533))

## [1.1.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.1.2...v1.1.3) (2024-02-23)


### Bug Fixes

* Remove "type" field from package.json ([aadbbb0](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/aadbbb090a256e20e8437b5d9c7bf57cbfd0daf5))

## [1.1.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.1.1...v1.1.2) (2024-02-23)


### Bug Fixes

* changed back to CommonJS ([07174fc](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/07174fce92e3a0b660fe76b4baa862fd0d33ee72))

## [1.1.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.1.0...v1.1.1) (2024-02-23)


### Bug Fixes

* changed index.js to ES ([d55351e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/d55351ed380ceeb2c15d89f4b9db7e85c5250937))

# [1.1.0](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.7...v1.1.0) (2024-02-23)


### Bug Fixes

*  Remove redundant Docker configuration ([2b1be8f](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/2b1be8f41a1036c8237f689d2addf29beedaedea))
* Remove Dockerfile and update eslint rule ([63d6d03](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/63d6d033a3614be9a0e132e25ff5eb94b7448505))


### Features

* Added a rule to convert unnamed default exports to named default exports based on the file name ([cfda4c1](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/cfda4c16bbba11b281a45deca8ca8742ecab23e9))

## [1.0.7](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.6...v1.0.7) (2024-02-22)


### Bug Fixes

* test ([99d8a4f](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/99d8a4f325faaa425bc0ea0842567562441dcf2e))

## [1.0.6](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.5...v1.0.6) (2024-02-22)


### Bug Fixes

* 7 ([f397bee](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/f397bee5676832b8b11e95dc52e0b8e83c5e5940))

## [1.0.5](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.4...v1.0.5) (2024-02-22)


### Bug Fixes

* 6 ([e4b80fd](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/e4b80fdea4d224b880c114e8ac5c433131f46e58))

## [1.0.4](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.3...v1.0.4) (2024-02-22)


### Bug Fixes

* 3 ([de1546e](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/de1546eff2921718c6cfd6d6c4e8d6f82b178847))
* 5 ([8d1b80d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/8d1b80d22129d1a5baaa7330f76645ef6e9f2cc9))

## [1.0.3](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.2...v1.0.3) (2024-02-22)


### Bug Fixes

* number 3 ([ac78e66](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/ac78e6685fcda4551a18f93afc0e05ecb232185c))

## [1.0.2](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.1...v1.0.2) (2024-02-22)


### Bug Fixes

* Update package.json version to 1.0.6 ([1c5409c](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/1c5409ce77ccc5fc4e35a975ffa328f59766c1d7))

## [1.0.1](https://github.com/tomerh2001/eslint-plugin-th-rules/compare/v1.0.0...v1.0.1) (2024-02-22)


### Bug Fixes

* semantic ([1e08f3d](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/1e08f3ddb5f1432307ce7a1e50863c9325ddbbfc))

# 1.0.0 (2024-02-22)


### Bug Fixes

* Add ESLint configuration and rules ([0197c62](https://github.com/tomerh2001/eslint-plugin-th-rules/commit/0197c62d8d4be2f8fd5ae67ad4c3a83370d5d678))
