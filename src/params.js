export const params = {

    PHYSICS: {

        // STIFFNESS: 0.35,
        // STIFFNESS: 0.13,
        STIFFNESS: 0.5,
        MAX_BOUNDS: 2.0,
        TIMESTEP: 0.01,
        // CLAMP: 0.001
        CLAMP: 0.0,
        STEPS: 1
    },

    CLOTH: {

        SIZE: 128

    },

    NOISE: {

        SPATIAL_FREQ: 0.4,
        TEMPORAL_FREQ: 0.1,
        AMP: 10.0,

    },

    SHADOW: {
        SIZE: 1024 * 2.0,
        // BIAS: 0.005
        BIAS: 0.01
    }

}