© 2022-2023 Eugene Kudashev

# what is MVP

the point of this document is to try to figure out the scope of the first version of the app that we launch as a public [limited] beta

## the promise

we need to understand what will we promise to people at this point (not in the future) -- what should they expect to get from the app?

**The Promise: this app will help you have better walks around the city and will encourage you to explore it and see it in a new way**

## what will fulfill the promise

what's the bare minimum?

at this point we might want to deconstruct the nature of the walks that people take right now. what do they already need? what's the tiniest real-world problem that we're trying to address?

## hypothetical existing needs

- i walked past a cool building today. i didn't take a picture and i didn't note the address. now i can't figure out where it was.
- i don't understand where i've been and where i haven't.
- i want to go for a walk but i don't know where to go.
- i want to record a certain place on my map (so that i don't lose it/forget it).

## how quickly can we make the app feel useful

what bothers me is that you need to have the app installed for 1-2 weeks before you get to see its value.

the map has to build up. the app is pointless without the data.

that means that we need to provide value in the meantime with some other elements.

because we can't afford to have the person install the app, not get the warm fuzzy feeling within the first minutes, close, never return. 

if we send them a push notification a week later, they wouldn't care. they already won't believe they will see magic -- because they didn't see magic the first time.

## so how would we entertain them while we don't have enough data to be useful?

since we can't do "cool enough" things with technology, **we'll entertain them with stories. we'll start a narrative.**

we begin the narrative by telling the person they are now an explorer. they have an adventure.

we tell them the city is their adventure now. their sole goal now is to really look at the city.

we promise them our help. but they'll be doing all the work.

**every day we give them a little quest.** every day they get a push notification with a little task that they need to do.

### examples of quests:

we can call them "walk ideas":

- find a quiet place
- find a strange sign
- find a building with an unusual shape
- find a sunny place
- find a place where you can think about tomorrow
- find a place to watch animals
- find a place to have a drink by yourself
- find a place to sit and read a book for an hour
- find a place to dance
- find a place to watch the sunset
- find a place which makes you feel like home
- find a place where you would bring someone on a date
- find an interestingly looking door
- find a place to watch other people
- find a place by the water
- find a walk in the park
- go to a place that means something personal to you
- go to your favourite place in the city
- take a tram
- go to a neighbourhood you've never been at
- find a street with a funny name
- go to the train station
- when you go for errands today, try to walk there in a different way than you normally would
- turn left where you always turn right
- find a bench with a good view

...

And so on.

We don't just give them the map of their movements and leave them to figure out everything.

We need to teach them to look. So that they will begin noticing the details, paying attention. Looking at the city in a different way.

Kind of like a child, in a way.

Incidentally, this way we achieve to things:

(1) We give them a reason to go for a walk, a little incentive, a bit of direction.
(2) We build a habit of opening the app every day -- and, consequently, seeing their traces gradually appear.

i'm sorry but this is fucking genius.

these things can be optional. they can be annoying for some people, and they should have the option to turn them off.

it's like: **we invite you to a play a game. you can play along, or you can opt out.** no one is forced. but i'd imagine that people LOVE games.

## the first walk

**something needs to happen on the first walk (or at the end of it) within the app itself so that a person would get the Grand Point of walking with the app, and not without it**

what could that be?

so far, we can just show the map with your traces on it.

is this groundbreaking? not quite. they've seen it in strava.

something else needs to happen.

## do we need the fog of war?

my original sketch contained the fog of war. do we need it?

to me, there feels to be a principal difference between drawing a blue line over existing visible map, and to uncovering map segments on an invisible, pitch-black dark map.

there is a sense of discovery there, a very game-like feeling. 

it's a cheap trick, and probably we don't need fog of war in the long run -- or maybe it could be optional, up to the person to decide -- but:

**in the very first minutes/days it could be very important as a trick to get people in, to get people to return.**

we play with their curiosity. everyone else shows all the stuff. we hide stuff. we get people curious by hiding stuff and inviting them to un-hide stuff.

so i'd argue that the experience should start WITH fog of war.

## the idea of a personalized map

**we want you to have your own version of the city.**

for that, you'll need to have the same freedom as with a paper map.

you can fold it. you can put it in your pocket. you can draw on it. make marks. highlight stuff, write stuff, draw stuff.

we need to replicate that. **we need to add the personal layer to the map. begin to create an emotional investment into the map -- and consequenly in the app itself.**

what that means:

- drawing on top of the map
- writing text on top of the map
- creating pins (saving your own points of interest)
- creating text notes for pins, adding photos/audio messages for pins

## app gradual progress

**i suggest looking at it as a relationship that develops between the person and the app.**

if the relationship is good, they will keep interacting with the app.

if not, they will end the relationship.

it would be wise to think ahead various stages as we see them to somehow prepare for them.

1. they just installed the app. (what do they expect? what will they receive?)
2. they spent a bunch of minutes in the app. (how do they feel about it now? does it seem to keep their attention? did it somehow change their expectations?)
3. they spent a day with the app in background. (do they have a good enough reason to open it again? did it manage to address any need they already had?)

... and so on

**this approach will help us to design for different stages in the app with different questions and needs in mind**

and we know that here we solve this, here we address that, etc. -- a better understanding of our goal(s) at each step

roughly i'd describe these app phases as: 

1. get them curious
2. hold their attention
3. solve an existing need => fulfill the promise => create a reason to use the app again to solve this need
4. show different ways to solve other needs
5. show different needs they didn't know they had

basically, climbing up the stairs of difficulty :)

## so what are the needs that we will be solving in the very beginning?

- you couldn't see where you've been and where you haven't.
- you couldn't make the map *really yours*. you couldn't freely write on a map, etc.
- you couldn't remember a place that you didn't write down (because writing it down is too much work).
- you couldn't record your impressions of city places / streets / areas in a meaningful way. like, if something matters to you. and why.

**maybe that should be the very first task that the app gives you? to do the basic "markup" of your city? to label some areas?**

## MVP definition

- a meaningful onboarding that will explain what to expect
- a map with fog of war which you uncover
  - fog of war can be removed within 24 hours (after all, it's just a welcome gimmick -- maybe? maybe not. it can work differently for different people.)
  - generally, we give you the freedom to customize the app: if you want to have a dark theme, if you want to have street names, etc. we want you to shape the map to your taste.
- putting text notes / making path highlights / drawing over the map (maybe screenshots with cool drawings will be something that people will send to each other? is this our Growth Hack™?)
- the whole "quests/prompts" thing (with a "quest log" in the app, and you completing quests -- with supporting evidence!)
- "submit a feature request / share an idea / contact support"
- walk history by calendar
- take a photo to add a place to your map

## open questions

- fog of war: y/n (see above)
- do we take path frequency into account, or would all traces have the same color/weight for now?
- how do we treat movement speed? walk/bike/public transport/car -- should they look differently?
- how customizable can the map be?
