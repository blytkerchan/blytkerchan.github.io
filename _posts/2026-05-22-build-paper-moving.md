---
title: "PSA: build-paper has moved to vln-devsecops"
date: 2026-05-22
tags: [github-actions, devops, announcement]
author: rlc
layout: post
---
If you've been using the `blytkerchan/build-paper` GitHub Action and recently noticed a missing or stale reference, this post is for you.
<!--more-->
The action has moved. Its new canonical home is:

**[`vln-devsecops/actions-build-paper`](https://github.com/vln-devsecops/actions-build-paper)**

## What changed

The action previously lived at [blytkerchan/build-paper](https://github.com/blytkerchan/blytkerchan/build-paper). As part of consolidating reusable CI/CD tooling under the [`vln-devsecops`](https://github.com/vln-devsecops) org, `build-paper` has been relocated there and renamed to `actions-build-paper` to follow that organization's naming conventions for shared actions.

The functionality is unchanged.

## Updating your workflows

If you're referencing the old location in a workflow file, update the `uses` line:

```yaml
# Before
- uses: blytkerchan/build-paper@v1

# After
- uses: vln-devsecops/actions-build-paper@v1
```

## Questions

Open an issue on the [new repository](https://github.com/vln-devsecops/actions-build-paper) if you run into anything unexpected during the migration.
