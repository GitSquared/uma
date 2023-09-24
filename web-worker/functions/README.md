# Worker thread functions

This folder is where functions that are bundled in the worker thread code are implemented or aliased.

Most functions here should be simple re-exports of implementations within the main `@lib/` folder, where they live next to the actual features or services that leverage them.

The `index.ts` file here is the main record of available functions and their expected I/O types, and is leveraged by both threads to communicate together.
