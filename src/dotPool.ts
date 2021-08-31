import {canvasCTX, width, height} from './clockFace.js'

export const Dot = {
    /** A gravitational pull in the X direction    
     * (positive = right and negative = left)   
     *  default = 0
     *  */
    GravityX: 0,

    /** A gravitational pull in the positive Y direction(down to floor)     
     * Have some fun! ... try a negative value
     * default = 50
    */
    GravityY: 50,

    /**
     * The coefficient of restitution (COR) is the ratio     
     * of the final to initial relative velocity between     
     * two objects after they collide.    
     * 
     * This represents the amount of 'bounce' a dot will exibit.    
     * 1.0 = full rebound, and 0.5 will rebound only    
     * half as high as the distance fallen.    
     * default = 0.5
     */
    Restitution: 0.5,

    /** 
     * The radius of dots   
     * default = 14px
     * */
    Radius: 14.0,

    /**
     * Half the Radius. Used in the rendering calculation of arcs(circles).    
     * We pre-calculated this value to prevent the cost of calculations in loops.    
     * default = 7px
     */
    HalfRadius: 7.0,

    /**
     * Radius Squared is used in the calculation of distances between dots.    
     * We pre-calculated this value to prevent the cost of calculations in loops.    
     * default = 14 * 14
     */
    Radius_Sqrd: 14 * 14,

    /** 
     * The Maximum Velocity that a dot may take when it recieves a random velocity.     
     * default = 500
     * */
    MaxVelocity: 500.0,

    /** 
     * Our default dot color (blue)     
     * */
    Color: '#44f',

    /**
     * Here we draw a dot(circle) on the screen (canvas).    
     * This method is used to create our 'static'    
     * time-value 'numbers' and 'colons' on the screen.
     * These are rendered as simple circles.    
     *     
     * A similar method, DotPool.renderFreeDot, is used to    
     * render animated dots using lines instead of circles.    
     * This will help emulate 'particle-com-trails'. (SEE: renderFreeDot below)
     */
    render: (x: number, y: number, color?: string) => {
        canvasCTX.fillStyle = color || Dot.Color
        canvasCTX.beginPath()
        canvasCTX.arc(x, y, Dot.HalfRadius, 0, 2 * Math.PI, true)
        canvasCTX.closePath()
        canvasCTX.fill()
    }
}

let idx = 0
let i = 0
let j = 0 
let distanceX = 0
let distanceY = 0
let delta = 0
let thisDistanceSquared = 0
let velocityDiffX = 0
let velocityDiffY = 0
let actualDistance = 0

let ratioX = 0
let ratioY = 0
let impactSpeed = 0
let newDotAx = 0
let newDotAy = 0
let newDotBx = 0
let newDotBy = 0

/**
 * Rather than using a variable sized set of individual Dot objects,
 * we build several fixed size arrays that provide all required
 * attributes that represent a pool of dots.
 * 
 * The main benefit, is the elimination of most garbage collection
 * that building and destroying many dots at 60 frames per second
 * would produce.
 *
 * We simply activate or inactivate an index(dot), by setting the value    
 * of the posX array. A positive integer in the posX array indicates    
 * 'active', and a value of -1 indicates an inactive index.    
 * Any index with an active posX value will be updated, tested for    
 * collisions, and rendered to the canvas.    
 *
 * New dot activations are always set at the lowest inactive posX-index.
 * We also maintain a 'tail pointer' to point to the highest active index.
 * This 'tail pointer' allows all 'loops' to only loop over elements presumed 
 * to be active.
 * These loops, from 0 to TailPointer, will also short circuit any index in
 * the loop that is inactive (has a posX value of -1).
 *
 * When a dot falls off the edge of the canvas, its posX is set inactive(-1).
 * If that dots index is equal to the tail-pointer value, we decrement
 * the TailPointer, effectively reducing the active pool size.
 *
 * Whenever a time-change(tick) causes the production of new 'animated' dots,
 * we simply find the first inactive index, and set it active by setting its
 * posX value to the x location of the 'time-dot' that is being set free.
 * If that first free-index is greater than the current tail, we set the tail-pointer
 * value to this new index, effectivly increasing the active pool size.
 *
 * This is a very efficient use of memory, and provides very efficient dot-animation
 * updates and collision-detection, as no new memory is required for each 'tick'.
 * This reduced presure on the garbage collector eliminates 'jank' that is common with
 * many forms of javascript animation where objects are created and destroyed per 'tick'.
 */
export class DotPool {

    /** A 'fixed' maximum number of dots this pool will contain. */
    static POOL_SIZE = 500

    /** An array of horizontal dot position values */
    posX: number[]

    /** An array of vertical dot position values */
    posY: number[]

    /** An array of last-known horizontal location values */
    lastX: number[]

    /** An array of last-known vertical location values */
    lastY: number[]

    /** An array of horizontal velocity values */
    velocityX: number[]

    /** An array of vertical velocity values */
    velocityY: number[]

    /** Points to the highest index that is currently set active. */
    tailPointer = 0

    /** The last 'tick' time (used for time-delta calculation). */
    lastTime: number

    /** the fill color to render dots(circles) with */
    static Color = Dot.Color

    /** Constructs a new DotPool object */
    constructor() {
        this.lastTime = Date.now()
        this.posX = []
        this.posY = []
        this.lastX = []
        this.lastY = []
        this.velocityX = []
        this.velocityY = []
        this.initializeDotPool()
    }

    /**
     * Returns a random velocity value
     * clamped by the value of Ball.MaxVelocity
     */
    randomVelocity() {
        return (Math.random() - 0.4) * Dot.MaxVelocity
    }

    /**
     * Initializes all DotPool value arrays.
     */
    initializeDotPool() {
        for (i = 0; i < DotPool.POOL_SIZE; i++) {
            this.posX[i] = -1
            this.posY[i] = 0
            this.lastX[i] = -1
            this.lastY[i] = 0
            this.velocityX[i] = this.randomVelocity()
            this.velocityY[i] = this.randomVelocity()
        }
    }

    /**
     * The main entry point for DotPool animations.
     * (called from the ClockFace animation loop 'ClockFace.tick()').
     * ClockFace.tick() is triggered by window.requestAnimationFrame().
     * We would expect ~ 60 frames per second here.
     */
    tick(thisTime: number) {
        delta = ((thisTime - this.lastTime) / 1000.0, 0.1)
        this.lastTime = thisTime
        this.updateDotPositions(delta)
        this.testForCollisions(delta)
    }

    /**
     * This method recalculates dot locations and velocities
     * based on a time-delta (time-change since last update).
     * 
     * This method also mutates velocity/restitution whenever
     * a wall or floor collision is detected.
     */
    updateDotPositions(delta: number) {

        // loop over all 'active' dots (all dots up to the tail pointer)
        for (i = 0; i < this.tailPointer + 2; i++) {

            // if this dot is inactive, skip over it and go on to the next
            if (this.posX[i] === -1) { continue }

            // use gravity to calculate our new velocity and position
            this.velocityX[i] += (Dot.GravityX * delta)
            this.velocityY[i] += (Dot.GravityY * delta)
            this.posX[i] += (this.velocityX[i] * delta)
            this.posY[i] += (this.velocityY[i] * delta)

            // did we hit a wall?
            if ((this.posX[i] <= Dot.Radius) || (this.posX[i] >= (width))) {

                // has it rolled off either end on the floor?
                if (this.posY[i] >= height - 2) {
                    this.posX[i] = -1 // -1 will inactivate this dot

                    // if this was the tail, decrement the tailPointer
                    if (i === this.tailPointer) {
                        this.tailPointer--
                    }
                    continue

                    // it was'nt on the floor so ... boune it off the wall
                } else {
                    if (this.posX[i] <= Dot.Radius) { this.posX[i] = Dot.Radius }
                    if (this.posX[i] >= (width)) { this.posX[i] = width }
                    // bounce it off the wall (restitution represents bounciness)
                    this.velocityX[i] *= -Dot.Restitution
                }
            }

            // did we hit the floor? If so, bounce it off the floor
            if (this.posY[i] >= height) {
                this.posY[i] = height
                // bounce it off the floor (restitution represents bounciness)
                this.velocityY[i] *= -Dot.Restitution
            }

            // did we hit the ceiling? If so, bounce it off the ceiling
            if (this.posY[i] <= Dot.Radius) {
                this.posY[i] = Dot.Radius
                // bounce it off the ceiling (restitution represents bounciness)
                this.velocityY[i] *= -Dot.Restitution
            }

            // draw this dot
            this.renderFreeDot(i)
        }
    }

    /**
     * This method tests for dots colliding with other dots.
     * When a collision is detected, we mutate the velocity values
     * of both of the colliding dots.
     */
    testForCollisions(delta: number) {

        // loop over all active dots in the pool
        for (i = 0; i < this.tailPointer + 2; i++) {
            // is this dot active?
            if (this.posX[i] === -1) { continue }
            // test this active dot against all other active dots
            for (j = 0; j < this.tailPointer + 2; j++) {
                if (i === j) { continue } // same dot, can't collide with self
                if (this.posX[j] === -1) { continue } // not an active dot
                distanceX = Math.abs(this.posX[i] - this.posX[j])
                distanceY = Math.abs(this.posY[i] - this.posY[j])

                // for efficiency, we use only the squared-distance
                // not the square-root of the squared-distance. square-root is very expensive
                thisDistanceSquared = distanceX ** 2 + distanceY ** 2

                // Are we about to collide?
                // here we compare the squared-distance to the squared-radius of a dot
                // again, we avoid expensive square-root calculations
                if (thisDistanceSquared < Dot.Radius_Sqrd) {

                    // the distance apart is less than a dots radius ... is it about to get greater?
                    // To see if dots are moving away from each other
                    // we calculate a future position based on the last delta.
                    if (this.newDistanceSquared(delta, i, j) > thisDistanceSquared) {
                        // distance apart is increasing, so these dots are moving away from each other
                        // just ignor and continue
                        continue
                    }
                    // if we got here we've collided
                    this.collideDots(i, j, distanceX, distanceY)
                }
            }
        }
    }
    /**
     * This method will calculate new velocity values
     * for both of the colliding dots.
     */
    collideDots(dotA: number, dotB: number, distanceX: number, distanceY: number) {

        thisDistanceSquared = distanceX ** 2 + distanceY ** 2

        velocityDiffX = this.velocityX[dotA] - this.velocityX[dotB]
        velocityDiffY = this.velocityY[dotA] - this.velocityY[dotB]

        // get the actual absolute distance (hypotenuse)
        actualDistance = Math.sqrt(thisDistanceSquared);

        // now we can callculate each dots new velocities

        // convert the distances to ratios
        ratioX = distanceX / actualDistance
        ratioY = distanceY / actualDistance

        // apply the speed (based on the ratios) to the velocity vectors
        impactSpeed = (velocityDiffX * ratioX) + (velocityDiffY * ratioY)
        this.velocityX[dotA] -= ratioX * impactSpeed
        this.velocityY[dotA] -= ratioY * impactSpeed
        this.velocityX[dotB] += ratioX * impactSpeed
        this.velocityY[dotB] += ratioY * impactSpeed
    }

    /**
     * Calculates a 'future' distance between two dots,
     * based on the last-known time-delta for the animations.
     * This is used to determin if the two dots are
     * moving toward, or away, from one another.
     */
    newDistanceSquared(delta: number, a: number, b: number) {
        newDotAx = this.posX[a] + (this.velocityX[a] * delta)
        newDotAy = this.posY[a] + (this.velocityY[a] * delta)
        newDotBx = this.posX[b] + (this.velocityX[b] * delta)
        newDotBy = this.posY[b] + (this.velocityY[b] * delta)
        return (Math.abs(newDotAx - newDotBx) ** 2) + (Math.abs(newDotAy - newDotBy) ** 2)
    }

    /**
     * Activates a dot-pool index, to create a new animated dot.
     * Whenever a time-number change causes one or more
     * dots to be 'freed' from the number display, we animated
     * them as if they exploded out of the number display.
     * We do this by activating the next available index,
     * setting its position to the position of the freed-dot,
     * and then assigning a random velocity to it.
     * If we have activated the array index pointed to by
     * tailPointer, we increment the tailPointer to maintain
     * our active pool size.
     */
    activate(x: number, y: number) {
        // loop though the pool to find an unused index
        // a value of '-1' for posX is used to indicate 'inactive'
        for (idx = 0; idx < this.tailPointer + 2; idx++) {
            if (this.posX[idx] === -1) {
                // add values for this dots location (this makes it 'active')
                this.posX[idx] = x
                this.posY[idx] = y
                this.lastX[idx] = x
                this.lastY[idx] = y
                this.velocityX[idx] = this.randomVelocity()
                this.velocityY[idx] = this.randomVelocity()
                // if this is past the tail, make this the tailPointer
                if (idx > this.tailPointer) this.tailPointer = idx

                // we're all done, break out of this loop
                break;
            }
        }
    }


    /**
     * This method renders a track of an animated(free)
     * dot in the dot pool.
     * 
     * Rather than static circles, we actually draw short lines
     * that represent the distance traveled since the last update.
     * These lines are drawn with round ends to better represent
     * a moving dot(circle). These short lines are automatically 
     * faded to black over time, to simulate a particle with a 'com-trail'.
     * SEE: ClockFace.tick() to understand this phenomenon.
     */
    renderFreeDot(i: number, ) {
        canvasCTX.beginPath()
        canvasCTX.fillStyle = Dot.Color
        canvasCTX.strokeStyle = Dot.Color
        canvasCTX.lineWidth = Dot.Radius
        canvasCTX.moveTo(this.lastX[i] - Dot.Radius, this.lastY[i] - Dot.Radius)
        canvasCTX.lineTo(this.posX[i] - Dot.Radius, this.posY[i] - Dot.Radius)
        canvasCTX.stroke()
        canvasCTX.closePath()
        canvasCTX.fill()
        this.lastX[i] = this.posX[i]
        this.lastY[i] = this.posY[i]
    }
}