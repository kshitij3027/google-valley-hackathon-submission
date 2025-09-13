# Game Context and Solutions

## Available Functions
- move_forward(steps=1): Move right by steps tiles
- jump(height=1): Hop over obstacles
- toggle_switch(): Flip nearby switch
- throw(): Throw ball 2 tiles ahead
- come_down(): Land from airborne state

## Level 1: Baby Steps
### Objective 1: Single Obstacle Jump
**Context**: Player faces a single obstacle that requires jumping
**Solution**: ["move_forward()", "jump()", "come_down()"]
**Explanation**: Move to obstacle, jump over it, then land

### Objective 2: Double Jump Challenge
**Context**: Player faces two consecutive obstacles
**Solution**: ["move_forward()", "jump()", "jump()", "come_down()"]
**Explanation**: Move forward, perform two consecutive jumps, then land

## Level 2: Activation & Terminations
### Objective 1: Bridge Activation
**Context**: Player must activate a bridge switch to cross
**Solution**: ["move_forward()", "toggle_switch()", "move_forward()", "move_forward()"]
**Explanation**: Move to switch, activate it, then cross the bridge

### Objective 2: Enemy Defeat
**Context**: Player must defeat an enemy blocking the path
**Solution**: ["move_forward()", "throw()", "move_forward()"]
**Explanation**: Move within range, throw projectile, then advance