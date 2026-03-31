export const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
    toObject: { virtuals: true },
};