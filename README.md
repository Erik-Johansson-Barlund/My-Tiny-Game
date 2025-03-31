# My Tiny Game Project

[Current state of the game](https://erik-johansson-barlund.github.io/My-Tiny-Game/)

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
