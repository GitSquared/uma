# Roger the Crawler

*REVERSE-CHRONOLOGICAL ITERATIVE PATH TRACING CRAWLER*

Roger is a software component that crawls back a set of recorded GPS points to trace the recorded path and draw its geometry.
The resulting geometries can be masked against a shape covering the whole world to produce a "cleared fog" effect.

## DESIGN

Roger was written with specific goals and operating constraints in mind. Here is a list of them and how they were addressed:

### GOALS

- **Show a first result as soon as possible** to the user, even if imperfect
  - Trace in reverse chronological order, starting with where the user is currently at
- **Draw a smooth shape** along the GPS path
  - Line buffering and polygon smoothing applied to the computed shapes
- Do not draw "insane" traces: make sure **drawn geometries are of high fidelity** to what happened IRL
  - sanity checks filter out low accuracy or non-ground altitude GPS points, and decide whether to link two points based on distance and time between them

### CONSTRAINTS

- Raw GPS trace data is super sensitive, private information that should **never leave the device**
  - Roger lives entirely within the app, and read/writes only on its local database
- The interface of the app must stay smooth and **reactive at all times**
  - The crawler works in a loop that processes only one GPS point at a time. After each loop it can be restarted to work on the next one, or more important UI work can be done first
- The crawler should be **resistant to sudden app kills**, crashes, or phone shutdowns
  - Each crawl produces an atomic unit of work that is saved to the database in a single transaction. The crawler is a pure function that will always return do the same work given the same state as input

## CRAWLING PROCESS

### STATE AND TARGETING

We assume that time doesn't go backwards, and that the GPS logs points in chronological order.
We want to trace in reverse chronological order, starting from the latest point and
working our way backwards, each time creating or expanding further to the past a "computed fog shape",
a geometric representation of the path cleared.

this timeline sketch shows the state of the crawler at a given time and the objects it
deals with:

```
 past
  |
  | <- more untraced points, and computed fog shapes…
  |
  – <- next computed fog shape's earliestPoint
  X
  X <- next computed fog shape
  X
  – <- next computed fog shape's latestPoint
  |
  |  <- untraced points
  |
  |  <- latest untraced point
  >- CURSOR - crawler is working here
  - <- last computed fog shape's earliestPoint
  X
  X <- last computed fog shape
  X
  - <- last computed fog shape's latestPoint, last point
present
```

In the state above, the crawler will trace the "latest untraced point".
Since there is a "last computed fog shape", it will expand it to include this new point.

### TRACING

Having identified the point to trace, the crawler draws a geometry corresponding to a cleared spot around that point, or a cleared path from that point to the last computed fog shape's `earliestPoint` (meaning, the next point in the GPS trace, chronologically). That behaviour is decided based on sanity checks on both points, like whether they are close enough to be realistically walked to in the time that was recorded between them.

The resulting geometry is merged with the last computed fog shape, expanding it. If there are no fog shapes below the cursor, a new computed fog shape is created.

A point can also be entirely skipped if it doesn't pass sanity checks, for instance because the GPS accuracy is too low or the point was recorded underground or in the sky. In that case, fog shapes' `earliestPoint` marker are updated without any changes to actual geometry.

### FOG SHAPES MERGING

Additionally, when we expand the last computed fog shape enough
that it becomes adjacent to the next computed fog shape, we want to merge them:

```
BEFORE                          AFTER TRACING                      AFTER MERGING

 past                            past                               past
  |                               |                                  |
  -                               >- CURSOR                          >- CURSOR
  X                               -                                  -
  X <- next computed fog shape    X                                  X
  X                               X <- next computed fog shape       X <- last computed fog shape
  -                               X                                  X    (single merged shape)
  |  <- latest untraced point     -                                  X <- point that was prev. traced
  >- CURSOR                       X <- point that was just traced    X
  -                               X                                  X
  X                               X <- last computed fog shape       X
  X <- last computed fog shape    X                                  X
  X                               X                                  -
  -                               -                                 present
present                          present
```
