---
title: "Beyond panning: 3D sound over headphones"
brief: HRTFs enhance immersion and provide more information to the player
date: 2026-09-20
bibliography:
  - id: armstrong2018
    author: C. Armstrong, L. Thresh, D. Murphy, and G. Kearney
    title: "A Perceptual Evaluation of Individual and Non-Individual HRTFs: A Case Study of the SADIE II Database"
    publisher: "Applied Sciences, vol. 8, no. 11, p. 2029"
    date: Nov. 2018
    doi: 10.3390/app8112029
    url: https://www.mdpi.com/2076-3417/8/11/2029
  - id: larsen2013
    author: Camilla Marie Larsen, David Skødt Lauritsen, Jacob Norvig Larsen, M. Pilgaard, and J. Madsen
    title: "Differences in human audio localization performance between a HRTF- and a non-HRTF audio system"
    publisher: "ACM International Conference Proceeding Series"
    date: Sept. 2013
    doi: 10.1145/2544114.2544118
    url: https://dl.acm.org/doi/10.1145/2544114.2544118
  - id: andersen2021
    author: J. S. Andersen, R. Miccini, S. Serafin, and S. Spagnol
    title: Evaluation of Individualized HRTFs in a 3D Shooter Game
    publisher: "2021 Immersive and 3D Audio: from Architecture to Automotive (I3DA), pp. 1-10"
    date: Sept. 2021
    doi: 10.1109/I3DA48870.2021.9610934
    url: https://itsadive.create.aau.dk/wp-content/uploads/2021/10/I3DA_2021.pdf
  - id: rodriguez2021
    author: M. Cuevas-Rodriguez, D. Gonzalez-Toledo, Arcadio Reyes-Lecuona, and L. Picinali
    title: Impact of non-individualised head related transfer functions on speech-in-noise performances within a synthesised virtual environment
    publisher: The Journal of the Acoustical Society of America, vol. 149, no. 4, pp. 2573–2586
    date: Apr. 2021
    doi: 10.1121/10.0004220
  - id: ellinger2017
    author: R. L. Ellinger, K. M. Jakien, and F. J. Gallun,
    title: The role of interaural differences on speech intelligibility in complex multi-talker environments
    publisher: The Journal of the Acoustical Society of America, vol. 141, no. 2, pp. EL170-EL176
    date: Feb. 2017
    doi: 10.1121/1.4976113
---

In games, audio serves a similar role to peripheral vision. Ambient audio provides a sense of space 
and activity in the game world, and entities can announce their presence to the player by making noise, 
even if they're out of view. However, most players don't use a surround sound setup to play their games.
So how do you know where sounds came from? The answer lies in how the game translates sounds within the
game world into a stereo signal.

By default, Unreal Engine, Unity, and Godot use panning to render stereo audio, conveying directionality only
by making one channel louder than the other. This process throws away a lot of information, and lacks all of
of the timing and equalization-based cues humans use to perceive audio in the real world. More specifically,
all three default to a panning algorithm reminiscent of two back-to-back cardioid microphones. This strategy
only differentiates sounds on the left/right axis.

![Gain by source angle]({{ './cardioid-panner.svg' | url }})

Head-related transfer functions (or HRTFs for short) offer a much more immersive and informative version of the
panning process by emulating how the human head and ears affect audio on its way to the ear. They can greatly improve
the sensation that a sound is coming from a specific direction, especially if they are personalized for the listener.
With HRTFs, sounds can be *externalized*, perceived as coming from a point in space rather than from inside the
head {% cite "armstrong2018" %}.

## Conveying More Information

HRTFs have been empirically shown to improve audio localization accuracy and performance compared to conventional
panning {% cite "larsen2013" %}. Moving from purely panning to HRTFs has been shown to improve performance in games
where this information is gameplay-relevant, such as first person shooters {% cite "andersen2021" %}. Individualization
of the HRTF has less consistent and generally smaller gameplay impacts compared to the transition from panning-only
to binaural audio. The information gain is particularly pronounced for locating audio sources behind, above, and below
the listener, where the audio source is likely to be offscreen.

## Mixing clarity: Spatial Release from Masking

In addition to improving the immersive experience of your game's soundscape, binaural audio
can also make it easier to distinguish between sounds coming from different directions {% cite "rodriguez2021" %}.
One component of HRTFs, called interaural time difference (i.e. ITD) has been shown to be effective at improving
the intelligibility of dialogue in the presence of other sounds, even independent of other HRTF effects {% cite "ellinger2017" %}.
This suggests that even simplified models of a head-related transfer function can be helpful, even without
emulating all of the effects the head and torso have on sound as it reaches the ear.

## When is this (not) worth it?

HRTFs and other spatial audio techniques are especially worth considering if acute spatial awareness or a sense of auditory
realism is important to your game. The benefits of HRTFs are especially applicable to first/third-person
action games, horror games, stealth games, and dialogue-heavy games. HRTFs also only account for the effects the human body introduces.
Many effects outside the body can also affect audio perception, such as early reflections, long-tail reverb, occlusion, and diffraction.

HRTFs are also generally designed to be used with headphones. Speaker users will want a toggle: the speakers' sound is filtered
again by the listener's real head, and each ear hears both speakers (crosstalk), which defeats the binaural cues. The result can
sound worse than plain panning.

In 2D games, there may be no meaningful 3D position associated with a sound source. In this case, the left/right axis distinction
can encode all of the useful information about a sound source. Similarly, non-diegetic sounds don't necessarily benefit from
being tied to a specific direction or position, especially since HRTFs alter the timbre of sounds in doing so.

HRTFs are more expensive than panning, but the cost is generally modest. On a Ryzen 7 AI 350, Steam Audio's HRTF implementation takes
2.9 μs per source per 256-sample block with nearest-neighbor HRTF lookup, or 4.1 μs with bilinear interpolation. At 48 kHz the block
deadline is 5.33 ms, so even 100 sources use about 5% or 8% of it, respectively. Measure on your weakest target hardware, since mobile,
console, and standalone VR chips are much slower than a recent laptop or desktop CPU. If your game has a large number of concurrent sounds,
it may be worth investigating ambisonic implementations, as their cost scales with spatial resolution rather than audio source count.

Lastly, realism isn't always desirable. Games are art, and deliberately omitting detail is one of the primary types
of stylization. My hope is that as time progresses, this sort of information loss is more commonly a conscious choice
than a default left unconsidered and unattended to.

## Quickstart

There are many existing ways to integrate HRTFs and other spatial audio techniques into your game.
Both FMOD and Wwise can route audio to platform-specific spatial audio systems where supported.
These systems usually come with HRTF-based headphone rendering, and often come with other
spatialization features, depending on the target platform. In FMOD, this is achieved via the FMOD
Spatializer effect, and in Wwise, it's done via their spatial audio listener. Both
also have integrations with several third-party software spatial audio systems.

If you want to use platform-independent spatial audio *without* a full audio middleware, both Unity
and Unreal Engine have plugins for Steam Audio. Start by just setting up HRTFs and occlusion from
large obstacles. Steam Audio is incredibly customizable and feature-rich, but you don't need to touch
most of the available options to get something that sounds good.

If you're using Godot, you're unfortunately kind of stuck. There is an [unofficial Steam Audio GDExtension](https://github.com/stechyo/godot-steam-audio/),
but it's still alpha, by the classical definition: it's not close to production ready as of time of writing.
Expect to encounter breakage, memory leaks, and other issues, and expect to patch them yourself (you can -
the extension is MIT licensed). In general, Godot's bus-based audio system isn't particularly compatible with
spatial audio, as bus effects only occur after mixing, and many effects would destroy the spatial cues HRTFs introduce.
Changes to the bus system that would allow for per-source effects have been proposed, but appears to be [stalled](https://github.com/godotengine/godot-proposals/issues/4435),
so you'll likely have to forego the bus system almost entirely.

If you're using a game framework or building your own engine, Steam Audio is open-source and has a well-documented API.
