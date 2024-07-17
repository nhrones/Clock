
// a few required clock-face constants
// these are used to define the shape of
// our 4 x 7 dot matrix, for the 7-segment 'LED' numbers
export const NUMBER_SPACING = 16
export const DOT_WIDTH = 16
export const DOT_HEIGHT = 16
export const MATRIX_WIDTH = 4;
export const MATRIX_HEIGHT = 7;

/*
 * Constants for dotPool
 */

/**
 * CTX configuration object 
 * */
export const CTX = {

   /** 
    * A false gravitational pull in the horizontal direction    
    * (positive = right and negative = left)   
    * default = 0
    */
   GravityX: 0,

   /** 
    * A gravitational pull in the positive Y direction(down to floor)     
    * Have some fun! ... try a negative value
    * default = 1600
    */
   GravityY: 750,

   /**
    * The coefficient of restitution (COR) is the ratio     
    * of the final to initial relative velocity between     
    * two objects after they collide.    
    * 
    * This represents the amount of 'bounce' a dot will exibit.    
    * 1.0 = full rebound, and 0.5 will rebound only    
    * half as high as the distance fallen.    
    * default = 0.8
    */
   Restitution: 0.5,

   /** 
    * The Maximum Velocity that a dot may take when it recieves a random velocity.     
    * default = 2400
    */
   MaxVelocity: 750
}

/** 
 * The radius of dots   
 * default = 14px
 */
export const Radius = 14

/**
 * Half the Radius. Used in the rendering calculation of arcs(circles).    
 * We pre-calculated this value to prevent the cost of calculations in loops.    
 */
export const HalfRadius = Radius * 0.5

/**
 * Radius Squared is used in the calculation of distances between dots.    
 * We pre-calculated this value to prevent the cost of calculations in loops.    
 * default = 14 * 14
 */
export const Radius_Sqrd = Radius * Radius

/** 
 * Our default dot color (blue)     
 */
export const Color = '#44f'


/**
 * A lookup array of 10 pixel masks(0-9).
 * Each mask(array) represents the pixels of
 * a 4 x 7 matrix of dots that are used to
 * display a 7 segment numeric display.
 * If a value in the mask is set to 1, that position
 * in this display will have a visual dot displayed.
 * A value of 0 will not be displayed.
 */
export const PIXELS = [
   // 'zero'
   [
       [1, 1, 1, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1]
   ],
   // 'one'
   [
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1]
   ],
   // 'two'
   [
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [1, 1, 1, 1],
       [1, 0, 0, 0],
       [1, 0, 0, 0],
       [1, 1, 1, 1]
   ],
   // 'three'
   [
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [1, 1, 1, 1]
   ],
   // 'four'
   [
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1]
   ],
   // 'five'
   [
       [1, 1, 1, 1],
       [1, 0, 0, 0],
       [1, 0, 0, 0],
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [1, 1, 1, 1]
   ],
   // 'six'
   [
       [1, 1, 1, 1],
       [1, 0, 0, 0],
       [1, 0, 0, 0],
       [1, 1, 1, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1]
   ],
   // 'seven'
   [
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1]
   ],
   // 'eight'
   [
       [1, 1, 1, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1]
   ],
   // 'nine'
   [
       [1, 1, 1, 1],
       [1, 0, 0, 1],
       [1, 0, 0, 1],
       [1, 1, 1, 1],
       [0, 0, 0, 1],
       [0, 0, 0, 1],
       [1, 1, 1, 1]
   ]
] as const
