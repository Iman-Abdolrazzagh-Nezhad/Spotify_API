function restrictTo(role, limit) {
    return limit.includes(role);
}

module.exports = restrictTo;