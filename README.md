# My Tiny Game Project

[Current state of the game](https://erik-johansson-barlund.github.io/My-Tiny-Game/)

## Development Log - 2025/04/06

### Changelog
- Adds Door class for rendering doors and door sprite
- Level generator now randomly generates a level
- Navigation between "Rooms"
- minimap showing layout and current location

I messed up real bad today.

I’ve heard whispers of the new Claude Code tool from Anthropic. People seem to be generally impressed with the capabilities of the tool and the quality of the generated code. Now I did decide early on that this project should be about writing code myself and not relying on AI in that capacity. And still, this is my forum for coding right now and is likely to remain so for the foreseeable future. If I want to try out a new tool, this codebase will be where I do it.

What harm could it possibly do? 👹

Now, no one has ever accused me of thinking through stuff too much. When I installed the CLI tool, I was already a couple of hours into coding. Sure, I could have merged what I had done up to that point, but where’s the fun in that? “Let Claude rip,” I thought to myself as I entered the command: “Please make the level generator create 5 rooms instead of 1.” Off it went—changing files, doing its thing. Within a minute, I had it. “COOL, make my new (unmerged) Door class connect the rooms.” Beep boop, there you go!

It went on like this for 5 minutes until the app crashed. Digging into the code, I realized that I now had multiple instances of functions within the same files, coordinates had been switched, and I had new variables being passed without being used on the other end. Claude sure is a messy little fucker.

I know it’s my fault. I take full responsibility. And at the same time, I’m glad I did it.

It took me 5 minutes and cost about $3 to thoroughly fuck up my codebase. Then it took me 3 hours more to unfuck it. In the process of retracing the AI’s steps, I realized that I truly did not like a lot of the code that had been generated. Bugs and crashes aside, it was some of the most awkward stuff I’ve seen in a while. You’ve got a ways to go there, bud.

I was talking about Claude with some friends just the other day, having the same ominous feelings I felt when ChatGPT first came on the scene. If it’s truly that good, why do they need us? Those fears are truly quenched. For the moment, I feel super secure; AI will not replace me anytime soon.

It wasn’t all a waste, though. As a bonus, while doing my bidding, it threw in a screen transition effect while switching screens. This was totally unprompted, as I hadn’t thought about that aspect at all. I kept that part of Claude’s work in; the rest I cleaned out as best I could.

The game is really starting to come together now. It almost feels like a game. 🤣 I think it’s time to start thinking about enemies.

Stay tuned for that.

![ezgif-60bcd19e8d9b94](https://github.com/user-attachments/assets/8af01762-7493-410e-b333-cfde1183f74d)

## Development Log - 2025/04/03

### Changelog
- Generic spriteAnimation class for handling animations
- A little guy

One could easily make the argument that pretty sprites are not really important during development and that the focus should be on logic and game design.

One could say that...

But sometimes, you just want a little guy ❤️

![ezgif-3188719551b575](https://github.com/user-attachments/assets/fbf95ca2-a186-44d9-9f34-169f940aafdf)


## Development Log - 2025/03/30

### Changelog
- Level now comes from a generator
- New collidable entity
- Collision detection between player and collidable entity
- New Rock class
- Depth sorting of entities

I'm realizing more and more that I know basically nothing about game dev. For each new step, I need to rethink a lot of what I've done up to that point. It doesn't help that I'm basically winging it without a real plan but it's super cool to see progress, no matter how incremental.

Today I put a rock in the game level. Doing that made me realize that the map is basically hardcoded into the game, and if this is ever going to be a roguelike, I need to be able to dynamically generate levels on the fly. That led to a stab at a level generator. It doesn't do much yet, but it does throw in a couple of rocks for good measure.

As the old saying goes: rocks and players should not mix. I had to take a crack at some collision detection. It works, I guess, but it's not very pretty to see the update method of the player class grow at an exponential rate. I definitely need to come back and clean this logic up.

I also realized that selling a faux 3D perspective requires some faux 3D occlusion. Basically, I had to add some sorting of the objects on screen so that if the player is beneath an object, the object is occluded, and if the player is above the object, it is drawn on top. Luckily, this was easier than expected. All we need to do is sort the objects based on their tile positions, and voilà, our faux 3D is in place.

![ezgif-41eb4ae13484d5](https://github.com/user-attachments/assets/3331f600-5cc6-4eff-9b0a-e2736072db55)

I assume these problems have been solved many times over by now, but they're new to me. I've had a lot of help from ChatGPT—discussing common game dev challenges, the pros and cons of different solutions, and the overall architecture of the app. It's like having a little game dev in a box. I'm trying my darndest not to have it generate code for me, but it's so nice to have a knowledgeable rubber duck for the project. I'm thankful for this tool for getting me unstuck time and time again.

---

## Development Log - 2025/03/29

Ahh, the start of a brand new project. The best feeling in the world 🔥. Most projects never reach production—you get stuck, get busy with other things, or simply lose interest. Maybe you leave it for a month, only to return to a project you once knew like the back of your hand—only to find that the code now makes less sense than a screen door on a submarine.

However, inevitably, as one project falls into oblivion, another is born. The latest, the shiniest, the new project.

Maybe it's to hold myself accountable that I had the idea to start a devlog related to this project. My aim is to write an entry with every update documenting the latest changes, the overall state of things, the process, and maybe even my own thoughts, struggles, and breakthroughs. Perhaps this approach will keep me **from abandoning** the project, like so many others in the past 🤞. Here's hoping!

This first push is close to a clean slate. I had the thought of creating a game, nothing too complex. I envisioned a simple 2D isometric adventure game, blending the classic feel of old Zelda with an upgrade system and room progression reminiscent of _The Binding of Isaac_. When written out, it does sound pretty ambitious. I guess I'd like to get to a point where I at least have a working demo or concept.

Right now, though, I have an isometric square where a yellow ball can move around. Not much, but it's a start.

![ezgif-2ffdfc622cb139](https://github.com/user-attachments/assets/0a431a89-6cd9-453f-841b-e23bd76aa662)

Here's to hoping it'll be more ✌️
