/** Fields safe to expose to the authenticated client */
const PUBLIC_USER_FIELDS = [
    "_id",
    "name",
    "email",
    "phone",
    "role",
    "profileImage",
    "status",
    "isApproved",
    "authProvider",
    "createdAt",
];

export const sanitizeUser = (user) => {
    if (!user) return null;
    const doc = user.toObject ? user.toObject() : { ...user };
    const safe = {};
    for (const key of PUBLIC_USER_FIELDS) {
        if (doc[key] !== undefined) safe[key] = doc[key];
    }
    if (doc.hasPassword !== undefined) safe.hasPassword = doc.hasPassword;
    return safe;
};

export const sanitizeCaregiver = (caregiver) => {
    if (!caregiver) return null;
    const doc = caregiver.toObject ? caregiver.toObject() : { ...caregiver };
    if (doc.userId && typeof doc.userId === "object") {
        doc.userId = sanitizeUser(doc.userId);
    }
    return doc;
};
